<template>
  <div class="q-pa-md movimentation-form__container" >

    <q-form
      @submit="onSubmit"
      class="q-gutter-md movimentation-form__form"
    >
      <q-input v-model="movimentation.date" filled type="date" hint="Data da Movimentação" />
      <PlanOfBillsSelect v-on:change="changePlanOfBills"/>
      <q-input
        filled
        v-model="movimentation.value"
        label="Valor da movimentação"
        mask="#.##"
        fill-mask="#"
        reverse-fill-mask
        input-class="text-right"
      />
      <q-input v-model="movimentation.payDate" filled type="date" hint="Data de pagamento" />
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>

<script>
import PlanOfBillsSelect from '../plan-of-bills/PlanOfBillsSelect.vue'
export default {
  components: {
    PlanOfBillsSelect
  },
  data () {
    return {
      movimentation: {
        date: '',
        value: '0.00',
        payDate: '',
        planOfBill: ''
      }

    }
  },

  methods: {
    onSubmit () {
      this.$axios.post('movimentations', { ...this.movimentation, value: Number(this.movimentation.value.replace(/\./g, '')) })
    },
    changePlanOfBills (planOfBills) {
      this.movimentation.planOfBill = planOfBills.value
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
   }
 }
</style>
