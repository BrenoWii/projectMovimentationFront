<template>
  <div class="q-pa-md movimentation-form__container" >
    <q-form
      @submit="onSubmit"
      class="q-gutter-md movimentation-form__form">
      <q-input v-model="user.firstName" filled type="text" hint="Nome" />
      <q-input v-model="user.lastName" filled type="text" hint="Sobrenome" />
      <q-input v-model="user.email" filled type="email" hint="Email" />
      <q-input v-model="user.password" filled type="password" hint="Senha" />
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>

  </div>
</template>

<script>
export default {
  name: 'UsersForm',
  data () {
    return {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async onSubmit () {
      await this.$axios.post('users', this.user)
      await this.refreshAll()
      this.$store.dispatch('users/getUsers')
      this.reset()
    },
    async refreshAll () {
      await Promise.all([
        this.$store.dispatch('classification/getClassifications'),
        this.$store.dispatch('planOfBills/getPlanOfBills'),
        this.$store.dispatch('movimentation/getMovimentations')
      ])
    },
    reset () {
      this.user = { firstName: '', lastName: '', email: '', password: '' }
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
