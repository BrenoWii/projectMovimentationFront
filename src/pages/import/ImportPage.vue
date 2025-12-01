<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Upload Section -->
      <div class="col-12" v-if="!hasAnalyzedData">
        <q-card>
          <q-card-section>
            <div class="text-h5 q-mb-md">Importar Extrato Bancário</div>
            <div class="text-subtitle2 text-grey-7 q-mb-md">
              Faça upload do arquivo CSV exportado do Nubank
            </div>

            <q-file
              v-model="selectedFile"
              filled
              accept=".csv"
              label="Selecione o arquivo CSV"
              @input="onFileSelected"
              :disable="isAnalyzing"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
              <template v-slot:append>
                <q-btn
                  v-if="selectedFile"
                  round
                  dense
                  flat
                  icon="close"
                  @click.stop="selectedFile = null"
                />
              </template>
            </q-file>

            <q-btn
              v-if="selectedFile"
              color="primary"
              label="Analisar Arquivo"
              icon="upload"
              class="q-mt-md full-width"
              :loading="isAnalyzing"
              @click="analyzeFile"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Stats and Review Section -->
      <div class="col-12" v-if="hasAnalyzedData">
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-sm-3">
                <q-chip color="primary" text-color="white" icon="receipt">
                  Total: {{ stats.total }}
                </q-chip>
              </div>
              <div class="col-12 col-sm-3">
                <q-chip color="positive" text-color="white" icon="check_circle">
                  Com sugestão: {{ stats.withSuggestion }}
                </q-chip>
              </div>
              <div class="col-12 col-sm-3">
                <q-chip color="warning" text-color="white" icon="help">
                  Sem sugestão: {{ stats.withoutSuggestion }}
                </q-chip>
              </div>
              <div class="col-12 col-sm-3 text-right">
                <q-btn
                  outline
                  color="grey"
                  label="Cancelar"
                  @click="clearData"
                  class="q-mr-sm"
                />
                <q-btn
                  color="positive"
                  label="Importar"
                  icon="save"
                  :disable="readyToImportCount === 0"
                  :loading="isImporting"
                  @click="importTransactions"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-table
          :data="analyzedRows"
          :columns="columns"
          row-key="description"
          :pagination.sync="pagination"
          flat
          bordered
        >
          <template v-slot:body-cell-select="props">
            <q-td :props="props">
              <q-checkbox
                v-model="props.row.selected"
                @input="toggleRowSelection(props.rowIndex, $event)"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-date="props">
            <q-td :props="props">
              {{ formatDate(props.row.date) }}
            </q-td>
          </template>

          <template v-slot:body-cell-value="props">
            <q-td :props="props">
              <span :class="props.row.type === 'DESPESA' ? 'text-negative' : 'text-positive'" style="font-weight: 600">
                {{ formatCurrency(props.row.value) }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-description="props">
            <q-td :props="props">
              <div class="ellipsis" style="max-width: 300px">
                {{ props.row.description }}
              </div>
              <q-tooltip v-if="props.row.description && props.row.description.length > 50">
                {{ props.row.description }}
              </q-tooltip>
            </q-td>
          </template>

          <template v-slot:body-cell-confidence="props">
            <q-td :props="props">
              <q-badge :color="getConfidenceColor(props.row.confidence)">
                {{ getConfidenceLabel(props.row.confidence) }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-suggestion="props">
            <q-td :props="props">
              {{ props.row.suggestion ? props.row.suggestion.description : '-' }}
            </q-td>
          </template>

          <template v-slot:body-cell-classification="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <div class="col">
                  <ClassificationSelect
                    v-model="props.row.classificationId"
                    @change="updateClassification(props.rowIndex, $event)"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    size="sm"
                    color="accent"
                    round
                    dense
                    icon="add"
                    @click="openAddClassificationDialog"
                  >
                    <q-tooltip>Nova classificação</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-learn="props">
            <q-td :props="props" class="text-center">
              <q-checkbox
                v-model="props.row.learnMapping"
                :disable="!props.row.classificationId"
                @input="updateLearnMapping(props.rowIndex, $event)"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Dialog para adicionar classificação -->
    <q-dialog v-model="addClassificationDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Nova Classificação</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <ClassificationForm @saved="handleClassificationSaved" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { format as formatDateFns, parseISO } from 'date-fns'
import ClassificationForm from '../../components/classification/ClassificationForm.vue'
import ClassificationSelect from '../../components/classification/ClassificationSelect.vue'

export default {
  name: 'ImportPage',
  components: {
    ClassificationForm,
    ClassificationSelect
  },
  data () {
    return {
      selectedFile: null,
      addClassificationDialog: false,
      pagination: {
        rowsPerPage: 50
      },
      columns: [
        { name: 'select', label: '', field: 'select', align: 'center', style: 'width: 50px' },
        { name: 'date', label: 'Data', field: 'date', align: 'left', sortable: true, style: 'width: 110px' },
        { name: 'value', label: 'Valor', field: 'value', align: 'right', sortable: true, style: 'width: 120px' },
        { name: 'description', label: 'Descrição', field: 'description', align: 'left', style: 'max-width: 300px' },
        { name: 'confidence', label: 'Confiança', field: 'confidence', align: 'center', style: 'width: 100px' },
        { name: 'suggestion', label: 'Sugestão', field: 'suggestion', align: 'left', style: 'width: 150px' },
        { name: 'classification', label: 'Classificação', field: 'classification', align: 'left', style: 'width: 260px' },
        { name: 'learn', label: 'Aprender', field: 'learn', align: 'center', style: 'width: 100px' }
      ]
    }
  },
  computed: {
    ...mapGetters('import', ['getAnalyzedRows', 'getStats', 'isAnalyzing', 'isImporting', 'getRowsReadyToImport']),
    ...mapGetters('classification', ['getClassificationsSelect']),
    ...mapGetters('authentication', ['getUser']),
    userId () {
      return this.getUser && this.getUser.user && this.getUser.user.id ? this.getUser.user.id : null
    },
    analyzedRows () {
      return this.getAnalyzedRows
    },
    stats () {
      return this.getStats
    },
    hasAnalyzedData () {
      return this.analyzedRows.length > 0
    },
    classificationOptions () {
      return this.getClassificationsSelect
    },
    readyToImportCount () {
      return this.analyzedRows.filter(row => row.selected && row.classificationId).length
    }
  },
  async mounted () {
    await this.$store.dispatch('classification/getClassifications')
  },
  methods: {
    ...mapActions('import', ['analyzeFile', 'importBulk']),
    ...mapMutations('import', ['clearAnalyzedData', 'updateRowClassification', 'updateRowLearnMapping', 'updateRowSelection']),
    onFileSelected () {
      // Validação básica do arquivo
      if (this.selectedFile && !this.selectedFile.name.endsWith('.csv')) {
        this.$q.notify({
          type: 'negative',
          message: 'Por favor, selecione um arquivo CSV válido'
        })
        this.selectedFile = null
      }
    },
    async analyzeFile () {
      if (!this.selectedFile) return

      try {
        await this.$store.dispatch('import/analyzeFile', this.selectedFile)
        console.log('Stats:', this.stats)
        console.log('AnalyzedRows length:', this.analyzedRows.length)
        console.log('AnalyzedRows:', this.analyzedRows)
        this.$q.notify({
          type: 'positive',
          message: `${this.stats.total} transações analisadas com sucesso!`
        })
      } catch (error) {
        console.error('Erro ao analisar:', error)
        this.$q.notify({
          type: 'negative',
          message: 'Erro ao analisar arquivo. Verifique o formato.'
        })
      }
    },
    async importTransactions () {
      try {
        const result = await this.$store.dispatch('import/importBulk')
        this.$q.notify({
          type: 'positive',
          message: `${result.created || this.readyToImportCount} transações importadas com sucesso!`
        })

        // Atualizar lista de movimentações
        const params = this.userId ? { userId: this.userId } : {}
        await this.$store.dispatch('movimentation/getMovimentations', params)
      } catch (error) {
        console.error('Erro ao importar:', error)
        this.$q.notify({
          type: 'negative',
          message: 'Erro ao importar transações'
        })
      }
    },
    clearData () {
      this.clearAnalyzedData()
      this.selectedFile = null
    },
    updateClassification (index, classificationId) {
      this.updateRowClassification({ index, classificationId })
    },
    updateLearnMapping (index, learn) {
      this.updateRowLearnMapping({ index, learn })
    },
    toggleRowSelection (index, selected) {
      this.updateRowSelection({ index, selected })
    },
    async openAddClassificationDialog () {
      // Garantir que plano de contas está carregado
      await this.$store.dispatch('planOfBills/getPlanOfBills')
      this.addClassificationDialog = true
    },
    async handleClassificationSaved () {
      this.addClassificationDialog = false
      // Recarregar lista de classificações
      await this.$store.dispatch('classification/getClassifications')
      this.$q.notify({
        type: 'positive',
        message: 'Classificação criada com sucesso!'
      })
    },
    formatDate (dateStr) {
      if (!dateStr) return '-'
      const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr)
      return formatDateFns(date, 'dd/MM/yyyy')
    },
    formatCurrency (value) {
      if (value === null || value === undefined) return '-'
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value / 100)
    },
    getConfidenceColor (confidence) {
      const colors = {
        high: 'positive',
        medium: 'warning',
        low: 'orange',
        none: 'negative'
      }
      return colors[confidence] || 'grey'
    },
    getConfidenceLabel (confidence) {
      const labels = {
        high: 'Alta',
        medium: 'Média',
        low: 'Baixa',
        none: 'Nenhuma'
      }
      return labels[confidence] || '-'
    }
  }
}
</script>
