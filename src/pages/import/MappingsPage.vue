<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="row items-center">
          <div class="col">
            <div class="text-h5">Mapeamentos Aprendidos</div>
            <div class="text-subtitle2 text-grey-7">
              Gerenciar mapeamentos de descrições para classificações
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              label="Adicionar"
              icon="add"
              @click="openAddDialog"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input
          v-model="searchTerm"
          filled
          dense
          placeholder="Buscar por descrição..."
          debounce="300"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="searchTerm"
              name="close"
              class="cursor-pointer"
              @click="searchTerm = ''"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :data="filteredMappings"
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          :loading="isLoading"
          flat
        >
          <template v-slot:body-cell-classification="props">
            <q-td :props="props">
              {{ getClassificationName(props.row.classificationId) }}
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn
                dense
                flat
                round
                icon="edit"
                color="primary"
                @click="openEditDialog(props.row)"
              />
              <q-btn
                dense
                flat
                round
                icon="delete"
                color="negative"
                @click="confirmDelete(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialog Add/Edit -->
    <q-dialog v-model="dialogOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editingMapping ? 'Editar' : 'Adicionar' }} Mapeamento</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input
            v-model="formData.extractDescription"
            filled
            label="Descrição do Extrato"
            :rules="[val => !!val || 'Campo obrigatório']"
          />

          <q-select
            v-model="formData.classificationId"
            :options="classificationOptions"
            filled
            label="Classificação"
            emit-value
            map-options
            class="q-mt-md"
            :rules="[val => !!val || 'Campo obrigatório']"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn
            flat
            label="Salvar"
            color="primary"
            @click="saveMapping"
            :disable="!formData.extractDescription || !formData.classificationId"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MappingsPage',
  data () {
    return {
      searchTerm: '',
      dialogOpen: false,
      editingMapping: null,
      formData: {
        extractDescription: '',
        classificationId: null
      },
      pagination: {
        rowsPerPage: 50
      },
      columns: [
        { name: 'extractDescription', label: 'Descrição', field: 'extractDescription', align: 'left', sortable: true },
        { name: 'classification', label: 'Classificação', field: 'classificationId', align: 'left', sortable: true },
        { name: 'actions', label: 'Ações', field: 'actions', align: 'center', style: 'width: 120px' }
      ]
    }
  },
  computed: {
    ...mapGetters('mappings', ['getMappings', 'isLoading']),
    ...mapGetters('classification', ['getClassificationsSelect']),
    filteredMappings () {
      if (!this.searchTerm) return this.getMappings
      const search = this.searchTerm.toLowerCase()
      return this.getMappings.filter(m =>
        m.extractDescription && m.extractDescription.toLowerCase().includes(search)
      )
    },
    classificationOptions () {
      return this.getClassificationsSelect
    }
  },
  async mounted () {
    await Promise.all([
      this.$store.dispatch('mappings/getMappings'),
      this.$store.dispatch('classification/getClassifications')
    ])
  },
  methods: {
    ...mapActions('mappings', ['createMapping', 'updateMappingAction', 'deleteMapping']),
    getClassificationName (classificationId) {
      const classification = this.classificationOptions.find(c => c.value === classificationId)
      return classification ? classification.label : '-'
    },
    openAddDialog () {
      this.editingMapping = null
      this.formData = {
        extractDescription: '',
        classificationId: null
      }
      this.dialogOpen = true
    },
    openEditDialog (mapping) {
      this.editingMapping = mapping
      this.formData = {
        extractDescription: mapping.extractDescription,
        classificationId: mapping.classificationId
      }
      this.dialogOpen = true
    },
    async saveMapping () {
      try {
        if (this.editingMapping) {
          await this.$store.dispatch('mappings/updateMappingAction', {
            id: this.editingMapping.id,
            ...this.formData
          })
          this.$q.notify({
            type: 'positive',
            message: 'Mapeamento atualizado com sucesso!'
          })
        } else {
          await this.$store.dispatch('mappings/createMapping', this.formData)
          this.$q.notify({
            type: 'positive',
            message: 'Mapeamento criado com sucesso!'
          })
        }
        this.dialogOpen = false
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Erro ao salvar mapeamento'
        })
      }
    },
    confirmDelete (mapping) {
      this.$q.dialog({
        title: 'Confirmar',
        message: `Deseja realmente excluir o mapeamento "${mapping.extractDescription}"?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await this.$store.dispatch('mappings/deleteMapping', mapping.id)
          this.$q.notify({
            type: 'positive',
            message: 'Mapeamento excluído com sucesso!'
          })
        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: 'Erro ao excluir mapeamento'
          })
        }
      })
    }
  }
}
</script>
