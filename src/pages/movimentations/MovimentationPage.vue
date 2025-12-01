<template>
  <div>
    <Movimentations></Movimentations>
  </div>
</template>

<script lang="ts">
import Movimentations from '../../components/Movimentations/Movimentations.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'MovimentationPage',
  components: {
    Movimentations
  },
  computed: {
    ...mapGetters('authentication', ['getUser']),
    userId () {
      return this.getUser && this.getUser.user && this.getUser.user.id ? this.getUser.user.id : null
    }
  },
  async mounted () {
    console.log(this.$store)
    const params = this.userId ? { userId: this.userId } : {}
    this.$store.dispatch('movimentation/getMovimentations', params)
    this.$store.dispatch('planOfBills/getPlanOfBills')
    this.$store.dispatch('classification/getClassifications')
    this.$store.dispatch('users/getUsers')
  }
}
</script>

<style>
</style>
