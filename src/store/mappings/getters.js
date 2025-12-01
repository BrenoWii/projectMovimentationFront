export function getMappings (state) {
  return state.mappings
}

export function isLoading (state) {
  return state.isLoading
}

export function getMappingById (state) {
  return (id) => state.mappings.find(m => m.id === id)
}
