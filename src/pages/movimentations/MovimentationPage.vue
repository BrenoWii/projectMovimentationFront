<template>
  <div>
    <movimentationForm></movimentationForm>
    <Movimentations></Movimentations>
  </div>
</template>

<script lang="ts">
import Movimentations from '../../components/Movimentations/Movimentations.vue'
import movimentationForm from '../../components/Movimentations/MovimentationsForm.vue'

export default {
  name: 'MovimentationPage',
  components: {
    movimentationForm,
    Movimentations
  },
  async mounted () {
    console.log(this.$store)
    this.$store.dispatch('movimentation/getMovimentations')
    this.$store.dispatch('planOfBills/getPlanOfBills')
    this.$store.dispatch('classification/getClassifications')
    this.$store.dispatch('users/getUsers')
  }
}
</script>

<style>
</style>
