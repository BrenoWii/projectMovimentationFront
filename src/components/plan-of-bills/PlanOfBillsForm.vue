<template>
  <div class="q-pa-md movimentation-form__container" >
    <q-form
      @submit="onSubmit"
      class="q-gutter-md movimentation-form__form">
      <q-input v-model="planOfBills.description" filled type="text" hint="Descrição do Plano de Contas" />
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>

<script>
export default {
  name: 'PlanOfBillsForm',
  props: {
    plan: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      planOfBills: {
        description: null
      }
    }
  },
  computed: {
    isEdit () { return !!(this.plan && this.plan.id) }
  },
  mounted () {
    if (this.isEdit) this.planOfBills.description = this.plan.description || null
  },
  methods: {
    async onSubmit () {
      const payload = { description: this.planOfBills.description }
      let response
      if (this.isEdit) {
        response = await this.$axios.patch(`/plan-of-bills/${this.plan.id}`, payload)
      } else {
        response = await this.$axios.post('/plan-of-bills', payload)
      }
      console.log(response)
      await this.refreshAll()
      this.$emit('saved')
      this.onReset && this.onReset()
    },
    async refreshAll () {
      await Promise.all([
        this.$store.dispatch('classification/getClassifications'),
        this.$store.dispatch('planOfBills/getPlanOfBills'),
        this.$store.dispatch('movimentation/getMovimentations')
      ])
    }
  }
}
</script>
<style lang="scss" scoped>
 .movimentation-form{

   &__form{
     display: flex;
     align-items: center;
     justify-content: center;
     flex-direction: column;
   }
 }
</style>
