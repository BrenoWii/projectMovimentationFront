
import service from '../../Instances/Axios'

export const getMovimentations = async ({ commit }, params = {}) => {
  // filtra params vazios/indefinidos para não poluir a query
  const allowed = [
    'dateFrom', 'dateTo',
    'payDateFrom', 'payDateTo',
    'valueMin', 'valueMax',
    'planOfBillId', 'classificationId', 'userId'
  ]
  const qp = {}
  allowed.forEach((k) => {
    const v = params[k]
    if (v !== undefined && v !== null && v !== '') {
      qp[k] = String(v)
    }
  })

  return service
    .get('movimentations', { params: qp })
    .then(response => {
      const { data } = response
      // API retorna { movimentations: [...], summary: {...} }
      commit('MOVIMENTATIONS', data.movimentations || [])
      commit('SUMMARY', data.summary || {})
      return data
    })
}
