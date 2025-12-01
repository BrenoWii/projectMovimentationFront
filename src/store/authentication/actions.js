
import service from '../../Instances/Axios'
import { Notify } from 'quasar'

export const authUser = async ({ commit, ...rest }, user) => {
  return service
    .post('auth/login', {
      login: user.login,
      password: user.password
    })
    .then(response => {
      const { data } = response
      if (data.accessToken) {
        localStorage.setItem('user', JSON.stringify(data))
        commit('USER_LOGIN', data)
        return data
      }
      return null
    })
    .catch((err) => {
      console.log(err)
      Notify.create({
        type: 'negative',
        message: 'Usuário ou senha incorretos'
      })
      return null
    })
}
