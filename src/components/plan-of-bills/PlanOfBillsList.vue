<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Plano de Contas"
      :data="rows"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      no-data-label="Nenhum plano de contas cadastrado"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense flat round icon="edit" color="primary" @click="openEdit(props.row)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="editDialog">
      <q-card style="min-width: 500px;">
        <q-card-section>
          <div class="text-h6">Editar Plano de Contas</div>
        </q-card-section>
        <q-card-section>
          <PlanOfBillsForm v-if="current" :plan="current" @saved="onSavedEdit" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import PlanOfBillsForm from './PlanOfBillsForm.vue'
import { mapState } from 'vuex'

export default {
  name: 'PlanOfBillsList',
  data () {
    return {
      pagination: { rowsPerPage: 10 },
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
        { name: 'description', label: 'Descrição', field: 'description', align: 'left', sortable: true },
        { name: 'classifications', label: 'Classificações', field: (row) => this.formatClassifications(row), align: 'left' },
        { name: 'actions', label: 'Ações', field: 'actions', align: 'right' }
      ],
      editDialog: false,
      current: null
    }
  },
  components: { PlanOfBillsForm },
  computed: {
    ...mapState('planOfBills', ['planOfBills']),
    rows () {
      return this.planOfBills || []
    }
  },
  methods: {
    formatClassifications (row) {
      // Suporte a diferentes formas que o backend possa retornar
      // 1) row.classifications: array de objetos { description }
      // 2) row.classifications: array de strings
      // 3) ausência => '-'
      const list = row && row.classifications ? row.classifications : []
      if (!Array.isArray(list) || list.length === 0) return '-'
      return list
        .map(c => (c && c.description) ? c.description : (typeof c === 'string' ? c : ''))
        .filter(Boolean)
        .join(', ')
    },
    openEdit (row) {
      this.current = row
      this.editDialog = true
    },
    async onSavedEdit () {
      this.editDialog = false
      this.current = null
      await this.$store.dispatch('planOfBills/getPlanOfBills')
      await this.$store.dispatch('classification/getClassifications')
    }
  }
}
</script>

<style scoped>
 </style>
