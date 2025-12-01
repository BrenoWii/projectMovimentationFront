import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getMovimentations } from '../../../src/store/movimentation/actions'
import mockAxios from '../../../src/Instances/Axios'

// Mock do Axios
vi.mock('../../../src/Instances/Axios', () => ({
  default: {
    get: vi.fn()
  }
}))

describe('Movimentation Store - Actions', () => {
  let commit

  beforeEach(() => {
    commit = vi.fn()
    vi.clearAllMocks()
  })

  it('deve buscar movimentações com formato correto (movimentations + summary)', async () => {
    const mockResponse = {
      data: {
        movimentations: [
          {
            id: 1,
            date: '2025-11-04',
            value: 202234,
            classification: {
              id: 1,
              description: 'Pagamento',
              type: 'RECEITA'
            }
          }
        ],
        summary: {
          byClassification: [
            {
              classificationId: 1,
              classificationName: 'Pagamento',
              type: 'RECEITA',
              total: 202234,
              count: 1
            }
          ],
          byPlanOfBills: [
            {
              planOfBillId: 1,
              planOfBillName: 'Contas a Receber',
              total: 202234,
              count: 1
            }
          ]
        }
      }
    }

    mockAxios.get.mockResolvedValue(mockResponse)

    const result = await getMovimentations({ commit }, {})

    expect(mockAxios.get).toHaveBeenCalledWith('movimentations', { params: {} })
    expect(commit).toHaveBeenCalledWith('MOVIMENTATIONS', mockResponse.data.movimentations)
    expect(commit).toHaveBeenCalledWith('SUMMARY', mockResponse.data.summary)
    expect(result).toEqual(mockResponse.data)
  })

  it('deve filtrar parâmetros vazios da query string', async () => {
    mockAxios.get.mockResolvedValue({
      data: { movimentations: [], summary: {} }
    })

    await getMovimentations({ commit }, {
      dateFrom: '2025-01-01',
      dateTo: '',
      userId: null,
      classificationId: undefined,
      valueMin: 0
    })

    expect(mockAxios.get).toHaveBeenCalledWith('movimentations', {
      params: {
        dateFrom: '2025-01-01',
        valueMin: '0'
      }
    })
  })

  it('deve lidar com resposta vazia corretamente', async () => {
    const mockResponse = {
      data: {
        movimentations: [],
        summary: {}
      }
    }

    mockAxios.get.mockResolvedValue(mockResponse)

    await getMovimentations({ commit }, {})

    expect(commit).toHaveBeenCalledWith('MOVIMENTATIONS', [])
    expect(commit).toHaveBeenCalledWith('SUMMARY', {})
  })

  it('deve aceitar filtros de data e valor', async () => {
    mockAxios.get.mockResolvedValue({
      data: { movimentations: [], summary: {} }
    })

    await getMovimentations({ commit }, {
      dateFrom: '2025-01-01T00:00:00.000Z',
      dateTo: '2025-12-31T23:59:59.999Z',
      valueMin: 1000,
      valueMax: 5000
    })

    expect(mockAxios.get).toHaveBeenCalledWith('movimentations', {
      params: {
        dateFrom: '2025-01-01T00:00:00.000Z',
        dateTo: '2025-12-31T23:59:59.999Z',
        valueMin: '1000',
        valueMax: '5000'
      }
    })
  })

  it('deve aceitar filtro de usuário', async () => {
    mockAxios.get.mockResolvedValue({
      data: { movimentations: [], summary: {} }
    })

    await getMovimentations({ commit }, {
      userId: 2
    })

    expect(mockAxios.get).toHaveBeenCalledWith('movimentations', {
      params: {
        userId: '2'
      }
    })
  })
})
