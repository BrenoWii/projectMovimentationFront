<template>
  <div class="classification-select__input">
      <q-select
        filled
        v-model="selected"
        :options="filteredOptions"
        :label="label"
        :multiple="multiple"
        :use-chips="multiple"
        :emit-value="true"
        :map-options="true"
        use-input
        input-debounce="300"
        @filter="filterFn"
        @filter-abort="abortFilterFn"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
            <q-item-section>
              <q-item-label :class="getTypeClass(scope.opt.type)">{{ scope.opt.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:selected-item="scope">
          <span :class="getTypeClass(scope.opt.type)">{{ scope.opt.label }}</span>
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Nenhum resultado encontrado
            </q-item-section>
          </q-item>
        </template>
      </q-select>
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
      filteredOptions: [],
      openModalAdd: false
    }
  },
  computed: {
    ...mapGetters('classification', ['getClassificationsSelect'])
  },
  mounted () {
    this.filteredOptions = this.getClassificationsSelect
  },
  watch: {
    selected (value) {
      this.$emit('change', value)
      this.$emit('input', value)
    },
    value (val) {
      this.selected = val
    },
    getClassificationsSelect (newList) {
      this.filteredOptions = newList
    }
  },
  methods: {
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        if (needle === '') {
          this.filteredOptions = this.getClassificationsSelect
        } else {
          this.filteredOptions = this.getClassificationsSelect.filter(opt => {
            return opt.label && opt.label.toLowerCase().indexOf(needle) > -1
          })
        }
      })
    },
    abortFilterFn () {
      this.filteredOptions = this.getClassificationsSelect
    },
    getTypeClass (type) {
      if (type === 'RECEITA') {
        return 'text-positive'
      } else if (type === 'DESPESA') {
        return 'text-negative'
      }
      return ''
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
