<template>
  <div>
    <UsersForm />
    <UsersList />
  </div>
</template>

<script lang="ts">
import UsersForm from '../../components/Users/UsersForm.vue'
import UsersList from '../../components/Users/UsersList.vue'

export default {
  name: 'UsersPage',
  components: {
    UsersForm,
    UsersList
  },
  async mounted () {
    this.$store.dispatch('users/getUsers')
  }
}
</script>

<style>
</style>
