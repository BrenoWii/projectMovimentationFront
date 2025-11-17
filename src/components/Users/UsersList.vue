<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Usuários"
      :data="rows"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      no-data-label="Nenhum usuário cadastrado"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UsersList',
  data () {
    return {
      pagination: { rowsPerPage: 10 },
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
        { name: 'firstName', label: 'Nome', field: 'firstName', align: 'left', sortable: true },
        { name: 'lastName', label: 'Sobrenome', field: 'lastName', align: 'left', sortable: true },
        { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true }
      ]
    }
  },
  computed: {
    ...mapState('users', ['users']),
    rows () {
      return this.users || []
    }
  }
}
</script>

<style scoped>
</style>
