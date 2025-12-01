export function setMappings (state, mappings) {
  state.mappings = mappings
}

export function setIsLoading (state, value) {
  state.isLoading = value
}

export function addMapping (state, mapping) {
  state.mappings.push(mapping)
}

export function updateMapping (state, { id, data }) {
  const index = state.mappings.findIndex(m => m.id === id)
  if (index !== -1) {
    state.mappings.splice(index, 1, { ...state.mappings[index], ...data })
  }
}

export function removeMapping (state, id) {
  const index = state.mappings.findIndex(m => m.id === id)
  if (index !== -1) {
    state.mappings.splice(index, 1)
  }
}
