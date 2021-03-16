
import service from '../../Instances/Axios'

export const getMovimentations = async ({ commit, ...rest }, user) => {
  return service
    .get('movimentations')
    .then(response => {
      const { data } = response
      console.log(rest, commit)
      commit('MOVIMENTATIONS', data)
      return data
    })
}
