<template>
  <div class="q-pa-md movimentation-form__container" >
    <q-form
      @submit="onSubmit"
      class="q-gutter-md movimentation-form__form">
      <q-input v-model="planOfBills.description" filled type="text" hint="Descrição do Plano de Contas" />
      <ClassificationSelect v-on:change="onClassificationSelect"></ClassificationSelect>
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>

<script>
import ClassificationSelect from '../classification/ClassificationSelect'
export default {
  components: {
    ClassificationSelect
  },
  data () {
    return {
      planOfBills: {
        description: null,
        classification: null
      }
    }
  },
  methods: {
    async onSubmit () {
      const response = await this.$axios.post('/plan-of-bills', this.planOfBills)
      console.log(response)
    },
    onClassificationSelect (classification) {
      this.planOfBills.classification = classification.value
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
