import { describe, it, expect, vi, beforeEach } from 'vitest'
import { analyzeFile, importBulk } from '../../../src/store/import/actions'
import { setAnalyzedData, updateRowSelection, updateRowLearnMapping } from '../../../src/store/import/mutations'
import mockAxios from '../../../src/Instances/Axios'

// Mock do Axios
vi.mock('../../../src/Instances/Axios', () => ({
  default: {
    post: vi.fn()
  }
}))

describe('Import Store - Mutations', () => {
  describe('setAnalyzedData', () => {
    it('deve mapear dados com classificação sugerida e calcular tipo baseado no valor', () => {
      const state = {
        analyzedRows: [],
        stats: {}
      }

      const payload = {
        rows: [
          {
            date: '2025-11-01',
            value: -150,
            description: 'Compra',
            suggestedClassificationId: 1,
            suggestedClassificationName: 'Gastos',
            confidence: 0.9
          },
          {
            date: '2025-11-02',
            value: 200,
            description: 'Salário',
            suggestedClassificationId: 2,
            suggestedClassificationName: 'Receita',
            confidence: 0.95
          }
        ],
        stats: { total: 2, withSuggestion: 2, withoutSuggestion: 0 }
      }

      setAnalyzedData(state, payload)

      expect(state.analyzedRows).toHaveLength(2)

      // Primeira linha - DESPESA (valor negativo)
      expect(state.analyzedRows[0].type).toBe('DESPESA')
      expect(state.analyzedRows[0].classificationId).toBe(1)
      expect(state.analyzedRows[0].learnMapping).toBe(false)
      expect(state.analyzedRows[0].selected).toBe(true)
      expect(state.analyzedRows[0].suggestion.description).toBe('Gastos')

      // Segunda linha - RECEITA (valor positivo)
      expect(state.analyzedRows[1].type).toBe('RECEITA')
      expect(state.analyzedRows[1].classificationId).toBe(2)
      expect(state.analyzedRows[1].learnMapping).toBe(false)
      expect(state.analyzedRows[1].selected).toBe(true)

      expect(state.stats).toEqual({ total: 2, withSuggestion: 2, withoutSuggestion: 0 })
    })

    it('deve lidar com valores zero como RECEITA', () => {
      const state = { analyzedRows: [], stats: {} }
      const payload = {
        rows: [
          {
            date: '2025-11-01',
            value: 0,
            description: 'Teste',
            suggestedClassificationId: 1,
            suggestedClassificationName: 'Teste',
            confidence: 0.5
          }
        ],
        stats: {}
      }

      setAnalyzedData(state, payload)

      expect(state.analyzedRows[0].type).toBe('RECEITA')
    })

    it('deve manter sugestão null quando não houver classificação sugerida', () => {
      const state = { analyzedRows: [], stats: {} }
      const payload = {
        rows: [
          {
            date: '2025-11-01',
            value: -100,
            description: 'Teste',
            suggestedClassificationId: null,
            suggestedClassificationName: null,
            confidence: 0
          }
        ],
        stats: {}
      }

      setAnalyzedData(state, payload)

      expect(state.analyzedRows[0].suggestion).toBeNull()
      expect(state.analyzedRows[0].classificationId).toBeNull()
    })
  })

  describe('updateRowSelection', () => {
    it('deve atualizar seleção de uma linha', () => {
      const state = {
        analyzedRows: [
          { selected: true, classificationId: 1 },
          { selected: true, classificationId: 2 },
          { selected: true, classificationId: 3 }
        ]
      }

      updateRowSelection(state, { index: 1, selected: false })

      expect(state.analyzedRows[0].selected).toBe(true)
      expect(state.analyzedRows[1].selected).toBe(false)
      expect(state.analyzedRows[2].selected).toBe(true)
    })
  })

  describe('updateRowLearnMapping', () => {
    it('deve atualizar flag learnMapping de uma linha', () => {
      const state = {
        analyzedRows: [
          { learnMapping: false, classificationId: 1 },
          { learnMapping: false, classificationId: 2 }
        ]
      }

      updateRowLearnMapping(state, { index: 0, learn: true })

      expect(state.analyzedRows[0].learnMapping).toBe(true)
      expect(state.analyzedRows[1].learnMapping).toBe(false)
    })
  })
})

describe('Import Store - Actions', () => {
  let commit, state

  beforeEach(() => {
    commit = vi.fn()
    state = {
      analyzedRows: []
    }
    vi.clearAllMocks()
  })

  describe('analyzeFile', () => {
    it('deve chamar o backend com FormData e commit os dados', async () => {
      const file = new File(['test'], 'test.csv', { type: 'text/csv' })
      const mockResponse = {
        data: {
          rows: [
            {
              date: '2025-11-01',
              value: -100,
              description: 'Compra',
              suggestedClassificationId: 1,
              suggestedClassificationName: 'Gastos'
            }
          ],
          stats: { total: 1, withSuggestion: 1, withoutSuggestion: 0 }
        }
      }

      mockAxios.post.mockResolvedValue(mockResponse)

      await analyzeFile({ commit }, file)

      expect(mockAxios.post).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('setIsAnalyzing', true)
      expect(commit).toHaveBeenCalledWith('setAnalyzedData', mockResponse.data)
      expect(commit).toHaveBeenCalledWith('setIsAnalyzing', false)
    })

    it('deve lançar erro se análise falhar', async () => {
      const file = new File(['test'], 'test.csv')
      const error = new Error('Upload failed')

      mockAxios.post.mockRejectedValue(error)

      await expect(analyzeFile({ commit }, file)).rejects.toThrow('Upload failed')
      expect(commit).toHaveBeenCalledWith('setIsAnalyzing', false)
    })
  })

  describe('importBulk', () => {
    it('deve filtrar apenas linhas selecionadas e enviar ao backend', async () => {
      state.analyzedRows = [
        {
          date: '2025-11-01',
          value: -100,
          description: 'Compra',
          classificationId: 1,
          selected: true,
          learnMapping: false
        },
        {
          date: '2025-11-02',
          value: -50,
          description: 'Gasto',
          classificationId: 2,
          selected: false,
          learnMapping: false
        },
        {
          date: '2025-11-03',
          value: 200,
          description: 'Receita',
          classificationId: 3,
          selected: true,
          learnMapping: true
        }
      ]

      const mockResponse = { data: { success: true, imported: 2 } }
      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await importBulk({ commit, state })

      // Verificar que apenas linhas selecionadas foram enviadas
      const callArgs = mockAxios.post.mock.calls[0][1]
      expect(callArgs.items).toHaveLength(2)
      expect(callArgs.items[0].description).toBe('Compra')
      expect(callArgs.items[1].description).toBe('Receita')

      // Verificar que learnMapping foi enviado corretamente
      expect(callArgs.learnFromImport).toBe(true)

      expect(commit).toHaveBeenCalledWith('setIsImporting', true)
      expect(commit).toHaveBeenCalledWith('clearAnalyzedData')
      expect(commit).toHaveBeenCalledWith('setIsImporting', false)
      expect(result).toEqual(mockResponse.data)
    })

    it('deve incluir originalDescription no payload', async () => {
      state.analyzedRows = [
        {
          date: '2025-11-01',
          value: -100,
          description: 'Descrição normalizada',
          classificationId: 1,
          selected: true,
          learnMapping: false
        }
      ]

      mockAxios.post.mockResolvedValue({ data: { success: true } })

      await importBulk({ commit, state })

      const callArgs = mockAxios.post.mock.calls[0][1]
      expect(callArgs.items[0].originalDescription).toBe('Descrição normalizada')
    })

    it('deve lançar erro se import falhar', async () => {
      state.analyzedRows = [
        {
          date: '2025-11-01',
          value: -100,
          description: 'Compra',
          classificationId: 1,
          selected: true,
          learnMapping: false
        }
      ]

      const error = new Error('Import failed')
      mockAxios.post.mockRejectedValue(error)

      await expect(importBulk({ commit, state })).rejects.toThrow('Import failed')
      expect(commit).toHaveBeenCalledWith('setIsImporting', false)
    })

    it('deve enviar learnFromImport como false se nenhuma linha tiver learnMapping true', async () => {
      state.analyzedRows = [
        {
          date: '2025-11-01',
          value: -100,
          description: 'Compra',
          classificationId: 1,
          selected: true,
          learnMapping: false
        }
      ]

      mockAxios.post.mockResolvedValue({ data: { success: true } })

      await importBulk({ commit, state })

      const callArgs = mockAxios.post.mock.calls[0][1]
      expect(callArgs.learnFromImport).toBe(false)
    })
  })
})
