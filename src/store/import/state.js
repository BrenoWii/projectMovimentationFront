export default function () {
  return {
    analyzedRows: [],
    stats: {
      total: 0,
      withSuggestion: 0,
      withoutSuggestion: 0
    },
    selectedRows: [],
    isAnalyzing: false,
    isImporting: false
  }
}
