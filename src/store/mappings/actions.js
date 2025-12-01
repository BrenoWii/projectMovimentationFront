import axios from '../../Instances/Axios'

export async function getMappings ({ commit }) {
  commit('setIsLoading', true)
  try {
    const response = await axios.get('/mappings')
    commit('setMappings', response.data)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar mapeamentos:', error)
    throw error
  } finally {
    commit('setIsLoading', false)
  }
}

export async function createMapping ({ commit }, { extractDescription, classificationId }) {
  try {
    const response = await axios.post('/mappings', {
      extractDescription,
      classificationId
    })
    commit('addMapping', response.data)
    return response.data
  } catch (error) {
    console.error('Erro ao criar mapeamento:', error)
    throw error
  }
}

export async function updateMappingAction ({ commit }, { id, extractDescription, classificationId }) {
  try {
    const response = await axios.put(`/mappings/${id}`, {
      extractDescription,
      classificationId
    })
    commit('updateMapping', { id, data: response.data })
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar mapeamento:', error)
    throw error
  }
}

export async function deleteMapping ({ commit }, id) {
  try {
    await axios.delete(`/mappings/${id}`)
    commit('removeMapping', id)
  } catch (error) {
    console.error('Erro ao deletar mapeamento:', error)
    throw error
  }
}
