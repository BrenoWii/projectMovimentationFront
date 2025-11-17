import service from '../../Instances/Axios'

export const getUsers = async ({ commit }) => {
  return service
    .get('users')
    .then(response => {
      const { data } = response
      commit('USERS', data)
      return data
    })
}
