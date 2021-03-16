<template>
  <div class="classification-select__input">
      <q-select filled v-model="selected" :options="getClassificationsSelect" label="Classificações" />
      <q-btn size="sm" color="accent" round dense :icon="'add'" @click="openModalAdd = !openModalAdd"></q-btn>
      <q-dialog v-model="openModalAdd">
        <q-card>
          <q-card-section>
            <div class="text-h6">Cadastro de Classificação</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <ClassificationForm></ClassificationForm>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
  </div>
</template>

<script>
import ClassificationForm from '../classification/ClassificationForm.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    ClassificationForm
  },
  data () {
    return {
      selected: '',
      options: [],
      openModalAdd: false
    }
  },
  computed: {
    ...mapGetters('classification', ['getClassificationsSelect'])
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
