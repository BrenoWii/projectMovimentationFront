import { describe, it, expect } from 'vitest'

describe('Currency Formatting Utils', () => {
  const formatCurrency = (val) => {
    if (val === null || val === undefined || val === '') return '-'
    const num = typeof val === 'number' ? val : Number(val)
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num / 100)
  }

  const toCents = (val) => {
    if (val === null || val === undefined || val === '') return ''
    const onlyDigits = String(val).replace(/[^0-9]/g, '')
    if (!onlyDigits) return ''
    return Number(onlyDigits)
  }

  describe('formatCurrency', () => {
    it('deve formatar valores em centavos para reais', () => {
      expect(formatCurrency(100)).toMatch(/R\$\s+1,00/)
      expect(formatCurrency(1000)).toMatch(/R\$\s+10,00/)
      expect(formatCurrency(250050)).toMatch(/R\$\s+2.500,50/)
    })

    it('deve formatar valores negativos corretamente', () => {
      expect(formatCurrency(-100)).toMatch(/-R\$\s+1,00/)
      expect(formatCurrency(-1550)).toMatch(/-R\$\s+15,50/)
    })

    it('deve retornar "-" para valores inválidos', () => {
      expect(formatCurrency(null)).toBe('-')
      expect(formatCurrency(undefined)).toBe('-')
      expect(formatCurrency('')).toBe('-')
    })

    it('deve formatar strings numéricas', () => {
      expect(formatCurrency('100')).toMatch(/R\$\s+1,00/)
      expect(formatCurrency('5000')).toMatch(/R\$\s+50,00/)
    })

    it('deve formatar zero corretamente', () => {
      expect(formatCurrency(0)).toMatch(/R\$\s+0,00/)
    })
  })

  describe('toCents', () => {
    it('deve converter string de valor para centavos', () => {
      expect(toCents('10.50')).toBe(1050)
      expect(toCents('R$ 25,00')).toBe(2500)
      expect(toCents('1.234,56')).toBe(123456)
    })

    it('deve remover caracteres não numéricos', () => {
      expect(toCents('R$ 10,00')).toBe(1000)
      expect(toCents('abc123def')).toBe(123)
    })

    it('deve retornar string vazia para valores inválidos', () => {
      expect(toCents(null)).toBe('')
      expect(toCents(undefined)).toBe('')
      expect(toCents('')).toBe('')
      expect(toCents('abc')).toBe('')
    })

    it('deve converter números diretamente', () => {
      expect(toCents(100)).toBe(100)
      expect(toCents(1500)).toBe(1500)
    })
  })
})
