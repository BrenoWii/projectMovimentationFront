
import service from '../../Instances/Axios'

export const getPlanOfBills = async ({ commit, ...rest }, user) => {
  return service
    .get('plan-of-bills')
    .then(response => {
      const { data } = response
      commit('PLANOFBILLS', data)
      return data
    })
}
