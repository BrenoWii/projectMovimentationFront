import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const Router = (/* { store, ssrContext } */) => {
  const router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  router.beforeEach((to, from, next) => {
    // Rotas públicas que não exigem autenticação
    const publicPages = ['/login', '/login/create-login']
    const authRequired = !publicPages.includes(to.path)
    const userString = localStorage.getItem('user')
    const logout = to.path === '/logout'

    // Verifica se está fazendo logout
    if (logout) {
      localStorage.clear()
      return next('/login')
    }

    // Valida se o usuário está autenticado e tem um token válido
    let loggedIn = false
    if (userString) {
      try {
        const user = JSON.parse(userString)
        loggedIn = user && user.accessToken
      } catch (e) {
        // Se houver erro ao parsear, limpa o localStorage
        localStorage.removeItem('user')
        loggedIn = false
      }
    }

    // Redireciona para login se autenticação for necessária e usuário não estiver logado
    if (authRequired && !loggedIn) {
      return next('/login')
    }

    next()
  })

  return router
}

export default Router()
