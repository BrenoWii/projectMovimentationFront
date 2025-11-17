<template>
  <div>
    <PlanOfBillsForm />
    <PlanOfBillsList />
  </div>
</template>

<script lang="ts">
import PlanOfBillsForm from '../../components/plan-of-bills/PlanOfBillsForm.vue'
import PlanOfBillsList from '../../components/plan-of-bills/PlanOfBillsList.vue'

export default {
  name: 'PlanOfBillsPage',
  components: {
    PlanOfBillsForm,
    PlanOfBillsList
  },
  async mounted () {
    // Precisa dos dados de classificação para o formulário e carrega a lista
    this.$store.dispatch('classification/getClassifications')
    this.$store.dispatch('planOfBills/getPlanOfBills')
  }
}
</script>

<style>
</style>
