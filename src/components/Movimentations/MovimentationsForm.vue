<template>
  <div class="q-pa-md movimentation-form__container" >

    <q-form
      @submit="onSubmit"
      class="q-gutter-md movimentation-form__form"
    >
      <q-input v-model="date" filled type="date" hint="Data da Movimentação" />
      <ClassificationSelect v-on:change="changeClassification" />
      <q-input
        filled
        v-model="value"
        label="Valor da movimentação"
        prefix="R$"
        mask="#.##"
        fill-mask="#"
        reverse-fill-mask
        input-class="text-right"
      />
      <q-input v-model="payDate" filled type="date" hint="Data de pagamento" />
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>

<script>
import ClassificationSelect from '../classification/ClassificationSelect.vue'
export default {
  components: {
    ClassificationSelect
  },
  data () {
    return {
      date: '',
      value: '0.00',
      payDate: '',
      classificationId: null
    }
  },

  methods: {
    async onSubmit () {
      console.log(this)
      const valueNumber = this.toDecimal(this.value)
      const classificationObj = this.classificationId ? { id: this.classificationId } : null
      // Valida obrigatórios segundo contrato
      if (!this.date || classificationObj === null || valueNumber === null) {
        this.$q && this.$q.notify && this.$q.notify({ type: 'negative', message: 'Preencha data, classificação e valor.' })
        return
      }
      const payload = {
        date: this.date, // formato YYYY-MM-DD já aceito pelo backend
        value: valueNumber,
        classification: classificationObj,
        ...(this.payDate ? { payDate: this.payDate } : {})
      }
      await this.$axios.post('/movimentations', payload)
      await this.refreshAll()
      this.$emit('saved', payload)
      this.onReset && this.onReset()
    },
    toDecimal (raw) {
      if (raw === null || raw === undefined || raw === '') return null
      let s = String(raw).trim()
      // Normaliza separador decimal (aceita vírgula ou ponto)
      s = s.replace(',', '.')
      // Remove caracteres inválidos mantendo dígitos e primeiro ponto
      s = s.replace(/[^0-9.-]/g, '')
      // Se múltiplos pontos, mantém apenas o primeiro
      const parts = s.split('.')
      if (parts.length > 2) {
        s = parts.shift() + '.' + parts.join('')
      }
      const num = parseFloat(s)
      return Number.isFinite(num) ? num : null
    },
    async refreshAll () {
      await Promise.all([
        this.$store.dispatch('classification/getClassifications'),
        this.$store.dispatch('planOfBills/getPlanOfBills'),
        this.$store.dispatch('movimentation/getMovimentations')
      ])
    },
    changeClassification (classification) {
      console.log(classification)
      this.classificationId = classification
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
