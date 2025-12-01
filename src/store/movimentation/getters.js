export function getMovimentations (state) {
  return state.movimentations.map((item, index) => ({ ...item, index }))
}

export function getSummary (state) {
  return state.summary
}
