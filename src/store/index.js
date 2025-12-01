import Vue from 'vue'
import Vuex from 'vuex'
import authentication from './authentication'
import movimentation from './movimentation'
import classification from './classification'
import planOfBills from './plan-of-bills'
import users from './users'
import importModule from './import'
import mappings from './mappings'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      authentication,
      movimentation,
      classification,
      planOfBills,
      users,
      import: importModule,
      mappings,
      // Alias de compatibilidade para chamadas antigas usando 'plan-of-bills/...'
      'plan-of-bills': planOfBills
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
