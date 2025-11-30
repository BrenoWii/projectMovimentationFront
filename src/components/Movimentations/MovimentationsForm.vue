<template>
  <div class="movimentation-form__container">
    <q-form @submit="onSubmit" class="movimentation-form__form">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <q-input
            v-model="date"
            filled
            type="date"
            label="Data da Movimentação"
            :rules="[val => !!val || 'Campo obrigatório']"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-input>
        </div>

        <div class="col-12">
          <ClassificationSelect v-model="classificationId" @change="changeClassification" />
        </div>

        <div class="col-12 col-sm-6">
          <q-input
            filled
            v-model="value"
            label="Valor"
            prefix="R$"
            mask="#.##"
            fill-mask="#"
            reverse-fill-mask
            input-class="text-right"
            :rules="[val => !!val || 'Campo obrigatório']"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-sm-6">
          <q-select
            filled
            v-model="paymentMethod"
            :options="paymentMethodOptions"
            label="Forma de Pagamento"
            clearable
            emit-value
            map-options
          >
            <template v-slot:prepend>
              <q-icon name="payment" />
            </template>
          </q-select>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col">
          <q-btn
            label="Cancelar"
            type="button"
            color="grey"
            flat
            @click="$emit('cancel')"
            class="full-width"
          />
        </div>
        <div class="col">
          <q-btn
            :label="movimentation && movimentation.id ? 'Atualizar' : 'Adicionar'"
            type="submit"
            color="primary"
            class="full-width"
          />
        </div>
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
  props: {
    movimentation: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      date: '',
      value: '0.00',
      classificationId: null,
      paymentMethod: '',
      paymentMethodOptions: [
        { label: 'Dinheiro', value: 'MONEY' },
        { label: 'PIX', value: 'PIX' },
        { label: 'Cartão de Crédito', value: 'CREDIT_CARD' },
        { label: 'Cartão de Débito', value: 'DEBIT_CARD' },
        { label: 'TED', value: 'TED' }
      ]
    }
  },

  watch: {
    movimentation: {
      immediate: true,
      handler (mv) {
        if (!mv) return
        // populate form fields from movimentation object
        // date fields: accept YYYY-MM-DD or ISO
        this.date = mv.date ? String(mv.date).split('T')[0] : ''
        // value stored in backend is centavos (inteiro); convert to reais
        const v = mv.value
        this.value = Number.isFinite(v) ? (v / 100).toFixed(2) : (mv.value ? String(mv.value) : '0.00')
        // classification id may be in different shapes
        this.classificationId = (mv.classification && mv.classification.id) || mv.classificationId || (mv.planOfBill && mv.planOfBill.classification && mv.planOfBill.classification.id) || null
        // payment method
        this.paymentMethod = mv.paymentMethod || ''
      }
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
        date: this.toIsoDate(this.date),
        value: valueNumber,
        payDate: this.toIsoDate(this.date),
        // for create we send classification as object, but for update backend accepts classificationId
        ...(classificationObj ? { classification: classificationObj } : {}),
        ...(this.paymentMethod ? { paymentMethod: this.paymentMethod } : {})
      }
      if (this.movimentation && this.movimentation.id) {
        // Update existing record - backend expects classificationId and value as number (reais)
        const updatePayload = {
          date: this.toIsoDate(this.date),
          value: valueNumber,
          payDate: this.toIsoDate(this.date),
          classificationId: this.classificationId || undefined,
          ...(this.paymentMethod ? { paymentMethod: this.paymentMethod } : {})
        }
        await this.$axios.patch(`/movimentations/${this.movimentation.id}`, updatePayload)
      } else {
        await this.$axios.post('/movimentations', payload)
      }
      await this.refreshAll()
      this.$emit('saved', payload)
      this.onReset && this.onReset()
    },
    toIsoDate (dateStr) {
      if (!dateStr) return null
      // Se já vier com T, assume formato ISO válido
      if (dateStr.includes('T')) return dateStr
      // Monta início do dia em UTC conforme exemplos do contrato
      return `${dateStr}T00:00:00Z`
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
.movimentation-form {
  &__container {
    width: 100%;
  }

  &__form {
    width: 100%;
  }
}
</style>
