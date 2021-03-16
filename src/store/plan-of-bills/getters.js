export function getPlanOfBillsSelect (state) {
  return state.planOfBills.map((item) => {
    return { label: item.description, value: item.id }
  })
}
