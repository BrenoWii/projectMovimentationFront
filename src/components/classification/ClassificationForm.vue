<template>
  <div class="q-pa-md movimentation-form__container" >
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md movimentation-form__form">
      <q-input v-model="description" filled type="text" hint="Descrição da Movimentação" />
      <planOfBills v-on:change="selectPanOfBills"></planOfBills>
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
          {label: 'Receita', value: 'receita'},
          {label: 'Despesa', value: 'despesa'}
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
      planOfBills: ''
    }
  },

  methods: {
    async onSubmit () {
      const response = await this.$axios.post('/classification', { type: this.type, description: this.description, planOfBills: this.planOfBills.value })
      console.log(response)
    },
    selectPanOfBills (planOfBills) {
      this.planOfBills = planOfBills
    },
    onReset () {
      this.name = null
      this.age = null
      this.accept = false
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
