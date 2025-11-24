<template>
  <div class="q-pa-md movimentation-form__container" >
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md movimentation-form__form">
      <q-input v-model="description" filled type="text" hint="Descrição da Movimentação" />
      <planOfBills v-on:change="selectPlanOfBills" />
      <q-btn-toggle
        v-model="type"
        spread
        class="my-custom-toggle"
        no-caps
        rounded
        unelevated
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
          {label: 'Receita', value: 'RECEITA'},
          {label: 'Despesa', value: 'DESPESA'}
        ]"
      />
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>

<script>
import planOfBills from '../plan-of-bills/PlanOfBillsSelect.vue'
export default {
  name: 'ClassificationForm',
  components: {
    planOfBills
  },
  data () {
    return {
      type: '',
      description: '',
      planOfBillId: null
    }
  },

  methods: {
    async onSubmit () {
      const response = await this.$axios.post('/classification', this.$data)
      console.log(response)
      await this.refreshAll()
      this.$emit('saved')
      this.onReset()
    },
    async refreshAll () {
      await Promise.all([
        this.$store.dispatch('classification/getClassifications'),
        this.$store.dispatch('planOfBills/getPlanOfBills'),
        this.$store.dispatch('movimentation/getMovimentations')
      ])
    },
    selectPlanOfBills (plan) {
      console.log(plan)
      this.planOfBillId = plan && plan.value ? plan.value : null
    },
    onReset () {
      this.type = ''
      this.description = ''
      this.planOfBillId = null
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
