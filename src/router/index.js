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
    const publicPages = ['/login']
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = localStorage.getItem('user')
    const logout = to.path === '/logout'

    if (authRequired && !loggedIn) {
      return next('/login')
    }
    if (logout) {
      localStorage.clear()
      return next('/login')
    }
    next()
  })

  return router
}

export default Router()
