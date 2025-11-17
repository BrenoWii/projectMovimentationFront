import Router from '../router'
import axios from 'axios'
import { Notify } from 'quasar'
const instance = axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 1000
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
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      config.headers.Authorization = `Bearer ${user.accessToken}`
      return config
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
