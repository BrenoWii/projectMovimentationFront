export function getAnalyzedRows (state) {
  return state.analyzedRows
}

export function getStats (state) {
  return state.stats
}

export function getSelectedRows (state) {
  return state.selectedRows
}

export function isAnalyzing (state) {
  return state.isAnalyzing
}

export function isImporting (state) {
  return state.isImporting
}

export function getRowsReadyToImport (state) {
  return state.analyzedRows.filter(row => row.classificationId)
}
