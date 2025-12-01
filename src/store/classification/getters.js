export function getClassificationsSelect (state) {
  return state.classifications.map((item) => {
    return {
      label: item.description,
      value: item.id,
      type: item.type
    }
  })
}
