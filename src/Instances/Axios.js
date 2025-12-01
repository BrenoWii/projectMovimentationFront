import Router from '../router'
import axios from 'axios'
import { Notify } from 'quasar'

// Use variável de ambiente ou fallback para IP do Tailscale
const baseURL = process.env.API_BASE_URL || 'http://100.113.154.3:3000/api/'

const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  withCredentials: true
})
instance.defaults.headers.common['Content-Type'] = 'application/json'

instance.getNotifyResponse = (response) => {
  const data = response.data
  const message = data.message ? data.message : this.getMessageHttpCode(response)

  if (Array.isArray(message)) {
    return message.map((message, index) => setTimeout(() => Notify.create(message), index * 1000))
  }
  return Notify.create(message)
}

instance.interceptors.request.use(
  async function (config) {
    const userString = localStorage.getItem('user')
    if (userString) {
      try {
        const user = JSON.parse(userString)
        if (user && user.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`
        }
      } catch (e) {
        console.error('Erro ao parsear usuário do localStorage:', e)
        localStorage.removeItem('user')
      }
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
// Interceptor
instance.interceptors.response.use(function (response) {
  const message = getMessageHttpCode(response)

  message && Notify.create(message, {
    type: 'positive',
    color: 'green',
    textColor: 'white',
    position: 'top-right',
    timeout: 2500
  })

  return response
}, function (error) {
  instance.getNotifyResponse(error.response)
  if (error.response.status === 401) {
    localStorage.clear()
    Router.push('login')
  }
  return Promise.reject(error)
})

const getMessageHttpCode = (response) => {
  switch (response.status) {
    case 201:
      return 'Processo Concluido'
    default:
      return false
  }
}

export default instance
