import axios from '../../Instances/Axios'

export async function analyzeFile ({ commit }, file) {
  commit('setIsAnalyzing', true)
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post('/import/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const { rows, stats } = response.data
    console.log('Dados recebidos do backend:', { rows, stats })
    commit('setAnalyzedData', { rows, stats })
    console.log('Analyzed rows após mutation:', rows)
    return response.data
  } catch (error) {
    console.error('Erro ao analisar arquivo:', error)
    throw error
  } finally {
    commit('setIsAnalyzing', false)
  }
}

export async function importBulk ({ commit, state }) {
  commit('setIsImporting', true)
  try {
    const items = state.analyzedRows
      .filter(row => row.classificationId && row.selected)
      .map(row => ({
        date: row.date,
        value: row.value,
        description: row.description,
        originalDescription: row.description,
        classificationId: row.classificationId,
        learnMapping: row.learnMapping
      }))

    const learnFromImport = state.analyzedRows.some(row => row.learnMapping)

    const response = await axios.post('/import/bulk', { items, learnFromImport })
    commit('clearAnalyzedData')
    return response.data
  } catch (error) {
    console.error('Erro ao importar transações:', error)
    throw error
  } finally {
    commit('setIsImporting', false)
  }
}
