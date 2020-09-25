<template>
  <div class="login">
    <div class="login-overlay">
      <div class="content-login">
        <h1>Criar conta</h1>
        <form
          @submit.prevent="handleSubmit"
          class="form-login"
        >
          <q-input
            class="input"
            name="firstName"
            v-model="user.firstName"
            placeholder="Nome"
          />
          <q-input
            class="input"
            name="lastName"
            v-model="user.lastName"
            placeholder="Sobre Nome"
          />
           <q-input
            class="input"
            type="text"
            name="email"
            v-model="user.email"
            placeholder="Email"/>
          <q-input
            class="input"
            type="password"
            name="password"
            v-model="user.password"
            placeholder="Password"/>
          <q-btn
            class="input"
            type="submit"
            color="primary"
            label="Entrar"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

export default {
  name: 'CreateAccount',
  data: () => {
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
    handleSubmit () {
      this.$axios.post('users', this.user)
        .then((Response) => {
          this.$router.push('/login')
          console.log(Response)
        })
        .catch((e) => {
          console.error(e)
        })
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
