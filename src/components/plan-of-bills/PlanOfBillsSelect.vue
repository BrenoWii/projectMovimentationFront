<template>
  <div class="classification-select__input">
      <q-select filled v-model="selected" :options="getPlanOfBillsSelect" label="Plano de contas" />
      <q-btn size="sm" color="accent" round dense :icon="'add'" @click="openModalAdd = !openModalAdd"></q-btn>
      <q-dialog v-model="openModalAdd">
        <q-card>
          <q-card-section>
            <div class="text-h6">Cadastro de Plano de Contas</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <PlanOfBillsForm @saved="openModalAdd = false"></PlanOfBillsForm>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
  </div>
</template>

<script>
import PlanOfBillsForm from './PlanOfBillsForm.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    PlanOfBillsForm
  },
  data () {
    return {
      selected: '',
      options: [],
      openModalAdd: false
    }
  },
  computed: {
    ...mapGetters('planOfBills', ['getPlanOfBillsSelect'])
  },
  watch: {
    selected (value) {
      this.$emit('change', value)
    }
  }
}
</script>
<style lang="scss" scoped>
.classification-select{
  &__input{
    display: flex;
    align-items: center;
  }
}
</style>
