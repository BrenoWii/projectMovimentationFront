<template>
  <div class="login">
    <div class="login-overlay">
      <div class="content-login">
        <h1>Project</h1>
        <form
          @submit.prevent="handleSubmit"
          class="form-login"
        >
          <q-input
            class="input"
            name="login"
            v-model="login"
            placeholder="Digite seu usuário"
          />
          <q-input
            class="input"
            type="password"
            name="password"
            v-model="password"
            float-label="Password"/>
          <q-btn
            class="input"
            type="submit"
            color="primary"
            label="Entrar"
          />
          <router-link to="/login/create-login">Criar Conta</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data: () => {
    return {
      login: '',
      password: ''
    }
  },
  methods: {
    ...mapActions('authentication', ['authUser']),
    async handleSubmit () {
      const payload = { login: this.login, password: this.password }
      const result = await this.authUser(payload)

      if (result) {
        this.$router.push('/movimentation')
      }
    }
  }
}
</script>

<style scoped>
  .login {
    background-image: url("../../assets/cabinet.png");
    background-repeat: no-repeat;
    background-position: 0;
    background-size: cover;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content-login {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    height: auto;
    padding: 60px 60px;
    background-color: aliceblue;
  }

  .form-login {
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .input {
    margin: 10px 0 0 0;
    width: 250px;
  }
</style>
