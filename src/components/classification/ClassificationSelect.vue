<template>
  <div class="classification-select__input">
      <q-select
        filled
        v-model="selected"
        :options="getClassificationsSelect"
        :label="label"
        :multiple="multiple"
        :use-chips="multiple"
        :emit-value="true"
        :map-options="true"
      />
      <q-btn size="sm" color="accent" round dense :icon="'add'" @click="openModalAdd = !openModalAdd"></q-btn>
      <q-dialog v-model="openModalAdd">
        <q-card>
          <q-card-section>
            <div class="text-h6">Cadastro de Classificação</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <ClassificationForm @saved="openModalAdd = false"></ClassificationForm>
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
  props: {
    value: {
      type: [Array, Number, String, Object, null],
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'Classificações'
    }
  },
  data () {
    return {
      selected: this.value || (this.multiple ? [] : ''),
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
      this.$emit('input', value)
    },
    value (val) {
      this.selected = val
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
