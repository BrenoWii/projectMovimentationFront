<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Classificações"
      :data="rows"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      no-data-label="Nenhuma classificação cadastrada"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ClassificationList',
  data () {
    return {
      pagination: { rowsPerPage: 10 },
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
        { name: 'description', label: 'Descrição', field: 'description', align: 'left', sortable: true },
        { name: 'type', label: 'Tipo', field: 'type', align: 'left', sortable: true },
        { name: 'planOfBill', label: 'Plano de Contas', field: (row) => row.planOfBill.description, align: 'left' }
      ]
    }
  },
  computed: {
    ...mapState('classification', ['classifications']),
    rows () {
      return this.classifications || []
    }
  }
}
</script>

<style scoped>
</style>
