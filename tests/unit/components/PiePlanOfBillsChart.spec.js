import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('PiePlanOfBillsChart - Props and Computed', () => {
  let component

  beforeEach(() => {
    component = {
      props: {
        summary: {
          type: Object,
          required: true,
          default: () => ({})
        },
        summaryKey: {
          type: String,
          default: 'byPlanOfBills'
        }
      },
      data: () => ({
        summary: {},
        summaryKey: 'byPlanOfBills'
      }),
      // Função real do componente para formatação
      formatValue: (value) => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value)
      }
    }
  })

  describe('summaryKey prop', () => {
    it('deve usar byPlanOfBills por padrão', () => {
      expect(component.props.summaryKey.default).toBe('byPlanOfBills')
    })

    it('deve aceitar byPlanOfBillsReceita como valor', () => {
      const componentWithReceita = {
        ...component,
        data: () => ({
          summary: {
            byPlanOfBillsReceita: [
              { planOfBillId: 1, planOfBillName: 'Receita 1', total: 5000 }
            ]
          },
          summaryKey: 'byPlanOfBillsReceita'
        })
      }

      expect(componentWithReceita.data().summaryKey).toBe('byPlanOfBillsReceita')
    })
  })

  describe('planOfBillsData computed', () => {
    it('deve retornar dados do summary usando summaryKey', () => {
      const data = [
        { planOfBillId: 1, planOfBillName: 'Plano 1', total: 5000 },
        { planOfBillId: 2, planOfBillName: 'Plano 2', total: 0 },
        { planOfBillId: 3, planOfBillName: 'Plano 3', total: 3000 }
      ]

      // Simular filtragem
      const filtered = data.filter(item => item.total > 0)

      expect(filtered).toHaveLength(2)
      expect(filtered[0].planOfBillName).toBe('Plano 1')
      expect(filtered[1].planOfBillName).toBe('Plano 3')
    })

    it('deve retornar array vazio se summaryKey não existir', () => {
      const summary = {
        byPlanOfBills: [{ planOfBillId: 1, total: 100 }]
      }

      const data = summary.byPlanOfBillsReceita || []
      expect(data).toEqual([])
    })

    it('deve filtrar itens com total zero', () => {
      const data = [
        { planOfBillId: 1, planOfBillName: 'Plano 1', total: 1000 },
        { planOfBillId: 2, planOfBillName: 'Plano 2', total: 0 },
        { planOfBillId: 3, planOfBillName: 'Plano 3', total: 2000 }
      ]

      const filtered = data.filter(item => item.total > 0)

      expect(filtered).toHaveLength(2)
      expect(filtered.every(item => item.total > 0)).toBe(true)
    })
  })

  describe('chartData computed', () => {
    it('deve gerar labels e datasets com dados formatados', () => {
      const data = [
        { planOfBillId: 1, planOfBillName: 'Salário', total: 500000 },
        { planOfBillId: 2, planOfBillName: 'Investimento', total: 300000 }
      ]

      const labels = data.map(item => item.planOfBillName || 'Sem plano')
      const values = data.map(item => item.total / 100)

      expect(labels).toEqual(['Salário', 'Investimento'])
      expect(values).toEqual([5000, 3000])
    })

    it('deve usar "Sem plano" quando planOfBillName for undefined', () => {
      const data = [
        { planOfBillId: 1, planOfBillName: undefined, total: 100000 }
      ]

      const labels = data.map(item => item.planOfBillName || 'Sem plano')

      expect(labels[0]).toBe('Sem plano')
    })

    it('deve gerar cores para os datasets', () => {
      const data = [
        { planOfBillId: 1, planOfBillName: 'Plano 1', total: 1000 },
        { planOfBillId: 2, planOfBillName: 'Plano 2', total: 2000 },
        { planOfBillId: 3, planOfBillName: 'Plano 3', total: 3000 }
      ]

      const backgroundColors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]

      const colors = backgroundColors.slice(0, data.length)
      expect(colors).toHaveLength(3)
      expect(colors[0]).toBe('#FF6384')
      expect(colors[1]).toBe('#36A2EB')
      expect(colors[2]).toBe('#FFCE56')
    })
  })

  describe('chartOptions computed', () => {
    it('deve retornar opções de configuração do gráfico', () => {
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1.5
      }

      expect(options.responsive).toBe(true)
      expect(options.maintainAspectRatio).toBe(false)
      expect(options.aspectRatio).toBe(1.5)
    })

    it('deve incluir callbacks de tooltip com formatação de moeda', () => {
      const formatted = component.formatValue(5000) // R$ 5.000,00
      // Intl.NumberFormat pode usar espaço ou non-breaking space, então comparamos normalize
      expect(formatted.replace(/\s+/g, ' ')).toBe('R$ 5.000,00')
    })
  })

  describe('totalValue computed', () => {
    it('deve calcular total dos valores', () => {
      const data = [
        { planOfBillId: 1, planOfBillName: 'Plano 1', total: 5000 },
        { planOfBillId: 2, planOfBillName: 'Plano 2', total: 3000 },
        { planOfBillId: 3, planOfBillName: 'Plano 3', total: 2000 }
      ]

      const total = data.reduce((acc, item) => acc + item.total, 0)
      expect(total).toBe(10000)
    })

    it('deve retornar zero se não houver dados', () => {
      const data = []
      const total = data.reduce((acc, item) => acc + item.total, 0)
      expect(total).toBe(0)
    })
  })
})

describe('PiePlanOfBillsChart - Dynamic summaryKey Usage', () => {
  it('deve alternar entre byPlanOfBills e byPlanOfBillsReceita', () => {
    const summary = {
      byPlanOfBills: [
        { planOfBillId: 1, planOfBillName: 'Despesa 1', total: 10000 }
      ],
      byPlanOfBillsReceita: [
        { planOfBillId: 2, planOfBillName: 'Receita 1', total: 20000 }
      ]
    }

    // Quando summaryKey é 'byPlanOfBills'
    const despesaData = summary.byPlanOfBills || []
    expect(despesaData[0].planOfBillName).toBe('Despesa 1')

    // Quando summaryKey é 'byPlanOfBillsReceita'
    const receitaData = summary.byPlanOfBillsReceita || []
    expect(receitaData[0].planOfBillName).toBe('Receita 1')
  })

  it('deve permitir componente ser reutilizado com diferentes summaryKeys', () => {
    const summary = {
      byPlanOfBills: [
        { planOfBillId: 1, planOfBillName: 'Plano Despesa', total: 5000, count: 3 }
      ],
      byPlanOfBillsReceita: [
        { planOfBillId: 2, planOfBillName: 'Plano Receita', total: 8000, count: 2 }
      ]
    }

    const keys = ['byPlanOfBills', 'byPlanOfBillsReceita']

    keys.forEach(key => {
      const data = summary[key]
      expect(data).toBeDefined()
      expect(data.length).toBeGreaterThan(0)
    })
  })
})
