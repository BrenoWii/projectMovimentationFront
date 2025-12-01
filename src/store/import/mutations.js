export function setAnalyzedData (state, { rows, stats }) {
  state.analyzedRows = rows.map(row => ({
    ...row,
    classificationId: row.suggestedClassificationId,
    learnMapping: false,
    selected: true,
    suggestion: row.suggestedClassificationName ? {
      id: row.suggestedClassificationId,
      description: row.suggestedClassificationName,
      confidence: row.confidence
    } : null,
    // Determinar tipo baseado no sinal do valor
    type: row.value < 0 ? 'DESPESA' : 'RECEITA'
  }))
  state.stats = stats
}

export function setSelectedRows (state, rows) {
  state.selectedRows = rows
}

export function setIsAnalyzing (state, value) {
  state.isAnalyzing = value
}

export function setIsImporting (state, value) {
  state.isImporting = value
}

export function clearAnalyzedData (state) {
  state.analyzedRows = []
  state.stats = { total: 0, withSuggestion: 0, withoutSuggestion: 0 }
  state.selectedRows = []
}

export function updateRowClassification (state, { index, classificationId }) {
  if (state.analyzedRows[index]) {
    state.analyzedRows[index].classificationId = classificationId
  }
}

export function updateRowLearnMapping (state, { index, learn }) {
  if (state.analyzedRows[index]) {
    state.analyzedRows[index].learnMapping = learn
  }
}

export function updateRowSelection (state, { index, selected }) {
  if (state.analyzedRows[index]) {
    state.analyzedRows[index].selected = selected
  }
}
