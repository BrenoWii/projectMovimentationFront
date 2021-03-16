
import service from '../../Instances/Axios'

export const getClassifications = async ({ commit, ...rest }, user) => {
  return service
    .get('classification')
    .then(response => {
      const { data } = response
      commit('CLASSIFICATIONS', data)
      return data
    })
}
