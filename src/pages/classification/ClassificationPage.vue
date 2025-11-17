<template>
  <div>
    <ClassificationForm />
    <ClassificationList />
  </div>
</template>

<script lang="ts">
import ClassificationForm from '../../components/classification/ClassificationForm.vue'
import ClassificationList from '../../components/classification/ClassificationList.vue'

export default {
  name: 'ClassificationPage',
  components: {
    ClassificationForm,
    ClassificationList
  },
  async mounted () {
    this.$store.dispatch('planOfBills/getPlanOfBills')
    this.$store.dispatch('classification/getClassifications')
  }
}
</script>

<style>
</style>
