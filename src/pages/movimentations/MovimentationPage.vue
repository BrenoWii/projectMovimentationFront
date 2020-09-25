<template>
    <div>teste</div>
</template>

<script lang="ts">

export default {
  name: 'MovimentationPage',
  async mounted () {
    const result = await this.$axios.get('/movimentations')
    console.log(result)
  }
}
</script>

<style>
</style>
