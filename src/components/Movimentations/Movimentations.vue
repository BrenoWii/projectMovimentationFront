
<template>
<div >
  <div class="q-pa-md">
    <div class="row q-col-gutter-sm items-end q-mb-md">
      <div class="col-6 col-sm-2">
        <q-input dense filled v-model="filters.dateFrom" type="date" label="Data de" />
      </div>
      <div class="col-6 col-sm-2">
        <q-input dense filled v-model="filters.dateTo" type="date" label="Data até" />
      </div>
      <div class="col-6 col-sm-2">
        <q-input dense filled v-model="filters.payDateFrom" type="date" label="Pgto de" />
      </div>
      <div class="col-6 col-sm-2">
        <q-input dense filled v-model="filters.payDateTo" type="date" label="Pgto até" />
      </div>
      <div class="col-6 col-sm-2">
        <q-input dense filled v-model="filters.valueMinDisplay" label="Valor mín (R$)" prefix="R$" inputmode="decimal" />
      </div>
      <div class="col-6 col-sm-2">
        <q-input dense filled v-model="filters.valueMaxDisplay" label="Valor máx (R$)" prefix="R$" inputmode="decimal" />
      </div>

      <div class="col-12 col-sm-3">
        <q-select
          dense filled clearable
          v-model="filters.planOfBillId"
          :options="planOptions"
          label="Plano de Contas"
          emit-value map-options
        />
      </div>

      <div class="col-12 col-sm-3">
        <q-select
          dense filled clearable
          v-model="filters.classificationId"
          :options="classificationOptions"
          label="Classificação"
          emit-value map-options
        />
      </div>

      <div class="col-12 col-sm-3">
        <q-select
          dense filled clearable
          v-model="filters.userId"
          :options="userOptions"
          label="Usuário"
          emit-value map-options
        />
      </div>

      <div class="col-12 col-sm-3 q-gutter-sm flex">
        <q-btn dense color="primary" label="Buscar" @click="fetchMovs" />
        <q-btn dense outline color="primary" label="Limpar" @click="clearFilters" />
        <q-btn dense color="positive" label="Adicionar" icon="add" @click="openAdd" />
      </div>
    </div>
     <q-table
      title="Movimentações"
      :data="getMovimentations"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[10, 25, 50, 100]"
      :pagination.sync="pagination"
      no-data-label="Nenhuma movimentação encontrada"
    >
      <template v-slot:body-cell-date="props">
        <q-td :props="props">{{ formatDate(props.row.date) }}</q-td>
      </template>
      <template v-slot:body-cell-payDate="props">
        <q-td :props="props">{{ formatDate(props.row.payDate) }}</q-td>
      </template>
      <template v-slot:body-cell-planOfBill="props">
        <q-td :props="props">{{ (props.row && props.row.planOfBill && props.row.planOfBill.description) || '-' }}</q-td>
      </template>
      <template v-slot:body-cell-classification="props">
          <q-td :props="props">{{ getClassification(props.row).description || '-' }}</q-td>
        </template>
        <template v-slot:body-cell-classificationType="props">
          <q-td :props="props">{{ getClassification(props.row).type || '-' }}</q-td>
      </template>
      <template v-slot:body-cell-paymentMethod="props">
        <q-td :props="props">{{ formatPaymentMethod(props.row.paymentMethod) }}</q-td>
      </template>
      <template v-slot:body-cell-value="props">
        <q-td :props="props" :class="getMovType(props.row) === 'DESPESA' ? 'text-negative' : 'text-positive'">
          {{ getMovType(props.row) === 'DESPESA' ? ('- ' + formatCurrency(props.row.value)) : formatCurrency(props.row.value) }}
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-center">
          <q-btn dense flat round icon="edit" color="primary" @click="openEdit(props.row)" />
          <q-btn dense flat round icon="delete" color="negative" class="q-ml-sm" @click="deleteMov(props.row)" />
        </q-td>
      </template>

    </q-table>
    <div class="q-mt-md text-weight-bold">
      Total: <span :class="totalMovimentationsValue < 0 ? 'text-negative' : 'text-positive'">{{ totalMovimentationsValueDisplay }}</span>
    </div>

    <q-dialog v-model="editDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Editar Movimentação</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <MovimentationsForm :movimentation="editingMov" @saved="handleSaved" @cancel="editDialog = false" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Nova Movimentação</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <MovimentationsForm @saved="handleAddSaved" @cancel="addDialog = false" />
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</div>
</template>
<script>
import MovimentationsForm from './MovimentationsForm.vue'
import { mapGetters } from 'vuex'
import { format as formatDateFns, parseISO, isValid } from 'date-fns'
export default {
  components: {
    MovimentationsForm
  },
  data () {
    return {
      columns: [
        {
          name: 'date',
          required: true,
          label: 'Data',
          align: 'left',
          field: 'date',
          sortable: true,
          style: 'width: 110px',
          headerStyle: 'width: 110px'
        },
        { name: 'payDate', align: 'left', label: 'Pagamento', field: 'payDate', sortable: true, style: 'width: 110px', headerStyle: 'width: 110px' },
        { name: 'classification', label: 'Classificação', field: 'classification', sortable: false },
        { name: 'classificationType', label: 'Tipo', field: 'classificationType', sortable: false, style: 'width: 90px', headerStyle: 'width: 90px' },
        { name: 'paymentMethod', label: 'Forma Pgto', field: 'paymentMethod', sortable: true, style: 'width: 130px', headerStyle: 'width: 130px' },
        { name: 'value', label: 'Valor', field: 'value' },
        { name: 'actions', label: 'Ações', field: 'actions', sortable: false, style: 'width: 120px', headerStyle: 'width: 120px', align: 'center' }
      ],
      editDialog: false,
      editingMov: null,
      addDialog: false,
      pagination: {
        sortBy: 'date',
        descending: true,
        rowsPerPage: 50
      },
      filters: {
        dateFrom: '',
        dateTo: '',
        payDateFrom: '',
        payDateTo: '',
        valueMinDisplay: '',
        valueMaxDisplay: '',
        planOfBillId: null,
        classificationId: null,
        userId: null
      }
    }
  },
  computed: {
    ...mapGetters('movimentation', ['getMovimentations']),
    ...mapGetters('planOfBills', ['getPlanOfBillsSelect']),
    ...mapGetters('classification', ['getClassificationsSelect']),
    ...mapGetters('users', { usersList: 'getUsers' }),
    planOptions () {
      return this.getPlanOfBillsSelect
    },
    classificationOptions () {
      return this.getClassificationsSelect
    },
    userOptions () {
      const list = Array.isArray(this.usersList) ? this.usersList : []
      return list.map(u => ({
        label: [u.firstName, u.lastName].filter(Boolean).join(' ') + (u.email ? ` (${u.email})` : ''),
        value: u.id
      }))
    },
    totalMovimentationsValue () {
      if (!Array.isArray(this.getMovimentations)) return 0
      return this.getMovimentations.reduce((acc, row) => {
        const raw = row && row.value
        const num = typeof raw === 'number' ? raw : Number(raw)
        if (!Number.isFinite(num)) return acc
        const type = (this.getClassification(row) && this.getClassification(row).type) || ''
        // Despesa subtrai, receita soma
        return type === 'DESPESA' ? acc - num : acc + num
      }, 0)
    },
    totalMovimentationsValueDisplay () {
      const total = this.totalMovimentationsValue
      const abs = Math.abs(total)
      const formatted = this.formatCurrency(abs)
      return total < 0 ? `- ${formatted}` : formatted
    }
  },
  methods: {
    openEdit (row) {
      this.editingMov = row
      this.editDialog = true
    },
    openAdd () {
      this.addDialog = true
    },
    handleSaved () {
      this.editDialog = false
      this.editingMov = null
      this.fetchMovs()
    },
    handleAddSaved () {
      this.addDialog = false
      this.fetchMovs()
    },
    async deleteMov (row) {
      if (!row || !row.id) return
      const ok = await this.$q && this.$q.dialog ? this.$q.dialog({ title: 'Confirmar', message: 'Deseja excluir esta movimentação?', cancel: true, persistent: true }).onOk(() => true).onCancel(() => false) : confirm('Deseja excluir esta movimentação?')
      if (!ok) return
      try {
        await this.$axios.delete(`/movimentations/${row.id}`)
        this.$q && this.$q.notify && this.$q.notify({ type: 'positive', message: 'Movimentação excluída' })
        this.fetchMovs()
      } catch (err) {
        console.error(err)
        this.$q && this.$q.notify && this.$q.notify({ type: 'negative', message: 'Erro ao excluir movimentação' })
      }
    },
    formatDate (val) {
      if (!val) return '-'
      const d = typeof val === 'string' ? parseISO(val) : new Date(val)
      return isValid(d) ? formatDateFns(d, 'dd/MM/yyyy') : String(val)
    },
    formatCurrency (val) {
      if (val === null || val === undefined || val === '') return '-'
      const num = typeof val === 'number' ? val : Number(val)
      // Assume backend stores centavos (inteiro); converter para reais
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num / 100)
    },
    formatPaymentMethod (method) {
      if (!method) return '-'
      const labels = {
        MONEY: 'Dinheiro',
        PIX: 'PIX',
        CREDIT_CARD: 'Cartão de Crédito',
        DEBIT_CARD: 'Cartão de Débito',
        TED: 'TED'
      }
      return labels[method] || method
    },
    toCents (val) {
      if (val === null || val === undefined || val === '') return ''
      const onlyDigits = String(val).replace(/[^0-9]/g, '')
      if (!onlyDigits) return ''
      return Number(onlyDigits)
    },
    toIsoDateBoundary (dateStr, endOfDay = false) {
      if (!dateStr) return undefined
      // Backend valida ISOString; montamos explicitamente para evitar problemas de timezone
      return `${dateStr}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`
    },
    fetchMovs () {
      const params = {
        dateFrom: this.toIsoDateBoundary(this.filters.dateFrom, false),
        dateTo: this.toIsoDateBoundary(this.filters.dateTo, true),
        payDateFrom: this.toIsoDateBoundary(this.filters.payDateFrom, false),
        payDateTo: this.toIsoDateBoundary(this.filters.payDateTo, true),
        valueMin: this.toCents(this.filters.valueMinDisplay) || undefined,
        valueMax: this.toCents(this.filters.valueMaxDisplay) || undefined,
        planOfBillId: this.filters.planOfBillId || undefined,
        classificationId: this.filters.classificationId || undefined,
        userId: this.filters.userId || undefined
      }
      this.$store.dispatch('movimentation/getMovimentations', params)
    },
    clearFilters () {
      this.filters = {
        dateFrom: '',
        dateTo: '',
        payDateFrom: '',
        payDateTo: '',
        valueMinDisplay: '',
        valueMaxDisplay: '',
        planOfBillId: null,
        classificationId: null,
        userId: null
      }
      this.fetchMovs()
    },
    getMovType (row) {
      // Tenta encontrar o tipo a partir das estruturas possíveis
      // row.planOfBill.classification.type (preferido)
      // ou campos alternativos que o backend possa expor
      return (
        (row && row.classification && row.classification.type) ||
        ''
      )
    },
    getClassification (row) {
      if (!row) return {}
      return (
        row.classification ||
        {}
      )
    }
  },
  mounted () {
    // Carregar dados necessários
    this.$store.dispatch('planOfBills/getPlanOfBills')
    this.$store.dispatch('classification/getClassifications')
    this.$store.dispatch('users/getUsers')
    // Carregar movimentações iniciais
    this.fetchMovs()
  }
}
</script>
