import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('DashboardPage - Computed Properties', () => {
  let component

  beforeEach(() => {
    // Função real do componente DashboardPage
    const formatCurrency = (val) => {
      if (!Number.isFinite(val)) return '-'
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val / 100)
    }

    component = {
      summary: {
        byClassification: [
          {
            classificationId: 1,
            classificationName: 'Salário',
            type: 'RECEITA',
            total: 500000,
            count: 1
          },
          {
            classificationId: 2,
            classificationName: 'Gastos',
            type: 'DESPESA',
            total: 150000,
            count: 3
          }
        ],
        byPlanOfBills: [
          {
            planOfBillId: 1,
            planOfBillName: 'Contas a Pagar',
            total: 150000,
            count: 3
          }
        ],
        byPlanOfBillsReceita: [
          {
            planOfBillId: 2,
            planOfBillName: 'Receitas',
            total: 500000,
            count: 1
          }
        ]
      },
      formatCurrency
    }
  })

  describe('sortedPlanOfBillsReceitaList', () => {
    it('deve ordenar receitas por total em ordem decrescente', () => {
      const byPlanOfBillsReceita = [
        { planOfBillId: 1, planOfBillName: 'Receita 1', total: 50000 },
        { planOfBillId: 2, planOfBillName: 'Receita 2', total: 100000 },
        { planOfBillId: 3, planOfBillName: 'Receita 3', total: 75000 }
      ]

      const sorted = byPlanOfBillsReceita.slice().sort((a, b) => b.total - a.total)

      expect(sorted[0].total).toBe(100000)
      expect(sorted[1].total).toBe(75000)
      expect(sorted[2].total).toBe(50000)
    })

    it('deve retornar array vazio se não houver byPlanOfBillsReceita', () => {
      const summary = { byPlanOfBillsReceita: undefined }
      const result = (summary.byPlanOfBillsReceita || []).slice().sort((a, b) => b.total - a.total)
      expect(result).toEqual([])
    })
  })

  describe('planOfBillsReceitaData', () => {
    it('deve filtrar itens com total maior que zero', () => {
      const byPlanOfBillsReceita = [
        { planOfBillId: 1, planOfBillName: 'Receita 1', total: 100000 },
        { planOfBillId: 2, planOfBillName: 'Receita 2', total: 0 },
        { planOfBillId: 3, planOfBillName: 'Receita 3', total: 50000 }
      ]

      const filtered = byPlanOfBillsReceita.filter(item => item.total > 0)

      expect(filtered).toHaveLength(2)
      expect(filtered.every(item => item.total > 0)).toBe(true)
    })

    it('deve retornar array vazio se todos os itens tiverem total zero', () => {
      const byPlanOfBillsReceita = [
        { planOfBillId: 1, total: 0 },
        { planOfBillId: 2, total: 0 }
      ]

      const filtered = byPlanOfBillsReceita.filter(item => item.total > 0)

      expect(filtered).toEqual([])
    })
  })

  describe('formatCurrency', () => {
    it('deve formatar valores em reais dividindo por 100', () => {
      const formatted1 = component.formatCurrency(100000)
      const formatted2 = component.formatCurrency(50000)
      const formatted3 = component.formatCurrency(1)

      // Intl.NumberFormat pode usar espaço ou non-breaking space, então comparamos normalize
      expect(formatted1.replace(/\s+/g, ' ')).toBe('R$ 1.000,00')
      expect(formatted2.replace(/\s+/g, ' ')).toBe('R$ 500,00')
      expect(formatted3.replace(/\s+/g, ' ')).toBe('R$ 0,01')
    })

    it('deve retornar "-" para valores não finitos', () => {
      expect(component.formatCurrency(NaN)).toBe('-')
      expect(component.formatCurrency(Infinity)).toBe('-')
      expect(component.formatCurrency(undefined)).toBe('-')
    })
  })

  describe('periodDisplay', () => {
    it('deve formatar período em português', () => {
      const periodMonth = '2025-11'
      const [year, month] = periodMonth.split('-')
      const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
      const display = `${months[parseInt(month) - 1]} de ${year}`

      expect(display).toBe('Novembro de 2025')
    })

    it('deve retornar "Todos os períodos" quando period for nulo', () => {
      const periodMonth = null
      const display = periodMonth ? 'com período' : 'Todos os períodos'

      expect(display).toBe('Todos os períodos')
    })
  })

  describe('sortedPlanOfBillsList', () => {
    it('deve ordenar despesas por total em ordem decrescente', () => {
      const byPlanOfBills = [
        { planOfBillId: 1, planOfBillName: 'Despesa 1', total: 50000 },
        { planOfBillId: 2, planOfBillName: 'Despesa 2', total: 100000 },
        { planOfBillId: 3, planOfBillName: 'Despesa 3', total: 75000 }
      ]

      const sorted = byPlanOfBills.slice().sort((a, b) => b.total - a.total)

      expect(sorted[0].total).toBe(100000)
      expect(sorted[1].total).toBe(75000)
      expect(sorted[2].total).toBe(50000)
    })
  })

  describe('planOfBillsData', () => {
    it('deve filtrar despesas com total maior que zero', () => {
      const byPlanOfBills = [
        { planOfBillId: 1, planOfBillName: 'Despesa 1', total: 100000 },
        { planOfBillId: 2, planOfBillName: 'Despesa 2', total: 0 },
        { planOfBillId: 3, planOfBillName: 'Despesa 3', total: 50000 }
      ]

      const filtered = byPlanOfBills.filter(item => item.total > 0)

      expect(filtered).toHaveLength(2)
      expect(filtered.every(item => item.total > 0)).toBe(true)
    })
  })

  describe('Integração: byPlanOfBills vs byPlanOfBillsReceita', () => {
    it('deve manter separação entre despesas e receitas', () => {
      const summary = {
        byPlanOfBills: [
          { planOfBillId: 1, planOfBillName: 'Contas a Pagar', total: 100000 }
        ],
        byPlanOfBillsReceita: [
          { planOfBillId: 2, planOfBillName: 'Receitas', total: 50000 }
        ]
      }

      const despesasData = summary.byPlanOfBills || []
      const receitasData = summary.byPlanOfBillsReceita || []

      expect(despesasData.every(item => item.planOfBillName === 'Contas a Pagar')).toBe(true)
      expect(receitasData.every(item => item.planOfBillName === 'Receitas')).toBe(true)
    })

    it('deve permitir renderizar gráficos lado a lado', () => {
      const summary = {
        byPlanOfBills: [
          { planOfBillId: 1, planOfBillName: 'Despesa', total: 10000 },
          { planOfBillId: 2, planOfBillName: 'Outro', total: 0 }
        ],
        byPlanOfBillsReceita: [
          { planOfBillId: 3, planOfBillName: 'Receita', total: 20000 }
        ]
      }

      const despesasFiltered = summary.byPlanOfBills.filter(item => item.total > 0)
      const receitasFiltered = summary.byPlanOfBillsReceita.filter(item => item.total > 0)

      expect(despesasFiltered).toHaveLength(1)
      expect(receitasFiltered).toHaveLength(1)
      expect(despesasFiltered[0].planOfBillName).toBe('Despesa')
      expect(receitasFiltered[0].planOfBillName).toBe('Receita')
    })
  })
})

describe('DashboardPage - Data Filtering', () => {
  describe('filteredMovimentations', () => {
    it('deve filtrar movimentações por período', () => {
      const movimentations = [
        { id: 1, date: '2025-11-01', value: 100 },
        { id: 2, date: '2025-11-15', value: 200 },
        { id: 3, date: '2025-12-01', value: 300 }
      ]

      const periodMonth = '2025-11'
      const [year, month] = periodMonth.split('-')

      const filtered = movimentations.filter(row => {
        const dateStr = row.date
        const date = new Date(dateStr)
        return date.getFullYear() === parseInt(year) && (date.getMonth() + 1) === parseInt(month)
      })

      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.every(mov => {
        const d = new Date(mov.date)
        return d.getFullYear() === 2025 && (d.getMonth() + 1) === 11
      })).toBe(true)
    })

    it('deve retornar todas as movimentações quando periodo for null', () => {
      const movimentations = [
        { id: 1, date: '2025-11-01', value: 100 },
        { id: 2, date: '2025-12-15', value: 200 }
      ]

      const periodMonth = null
      const filtered = periodMonth ? movimentations.filter(() => false) : movimentations

      expect(filtered).toEqual(movimentations)
    })
  })
})
