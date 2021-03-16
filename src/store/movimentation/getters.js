export function getMovimentations (state) {
  return state.movimentations.map((item, index) => ({ ...item, index }))
}
