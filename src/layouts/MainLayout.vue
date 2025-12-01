<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Fluxo de caixa App
        </q-toolbar-title>

        <div class="q-mr-md text-weight-medium">
          {{ userName }}
        </div>

        <q-btn
          flat
          dense
          round
          icon="logout"
          aria-label="Logout"
          @click="logout"
        >
          <q-tooltip>Sair</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Dashboard',
    caption: 'Resumo e Gráficos',
    icon: 'pie_chart',
    link: '/dashboard'
  },
  {
    title: 'Movimentações',
    caption: 'Movimentações registradas',
    icon: 'attach_money',
    link: '/movimentation'
  },
  {
    title: 'Importar Extrato',
    caption: 'Upload de CSV bancário',
    icon: 'cloud_upload',
    link: '/import'
  },
  {
    title: 'Mapeamentos',
    caption: 'Gerenciar aprendizado',
    icon: 'psychology',
    link: '/mappings'
  },
  {
    title: 'Usuários',
    icon: 'person',
    link: '/users'
  },
  {
    title: 'Plano de contas',
    icon: 'monetization_on',
    link: '/plan-of-bills'
  },
  {
    title: 'Classificações',
    icon: 'archive',
    link: '/classification'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  computed: {
    ...mapGetters('authentication', ['getUserName']),
    userName () {
      return this.getUserName
    }
  },
  mounted () {
    // Carregar usuário do localStorage se existir
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        console.log('Dados do usuário:', userData)
        this.$store.commit('authentication/USER_LOGIN', userData)
      } catch (e) {
        console.error('Erro ao carregar usuário:', e)
      }
    }
  },
  methods: {
    logout () {
      // Limpar token do localStorage
      localStorage.removeItem('token')
      // Redirecionar para login
      this.$router.push('/login')
    }
  }
}
</script>
