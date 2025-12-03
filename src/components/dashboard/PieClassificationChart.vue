<template>
  <div class="pie-chart-wrapper">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6" :class="movimentationType === 'RECEITA' ? 'text-positive' : 'text-negative'">{{ title || 'Distribuição por Classificação' }}</div>
        <div class="text-caption">Valores em R$ (absoluto por classificação)</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="chart-section">
        <div class="chart-container">
          <pie-chart-canvas :chart-data="chartData" :chart-options="chartOptions" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { Pie, mixins } from 'vue-chartjs'
import { mapGetters } from 'vuex'
// Wrapper component usando reatividade do vue-chartjs
const { reactiveProp } = mixins
const PieChartCanvas = {
  name: 'pie-chart-canvas',
  extends: Pie,
  mixins: [reactiveProp],
  props: {
    chartData: { type: Object, required: true },
    chartOptions: { type: Object, required: true }
  },
  mounted () {
    if (this.chartData && this.chartData.labels && this.chartData.labels.length > 0) {
      this.renderChart(this.chartData, this.chartOptions)
    }
  },
  watch: {
    chartData: {
      handler (newData) {
        if (newData && newData.labels && newData.labels.length > 0) {
          if (this.$data._chart) {
            this.$data._chart.destroy()
          }
          this.$nextTick(() => {
            this.renderChart(newData, this.chartOptions)
          })
        }
      },
      deep: true
    },
    chartOptions: {
      handler (newOptions) {
        if (this.$data._chart && this.chartData && this.chartData.labels && this.chartData.labels.length > 0) {
          this.$data._chart.destroy()
          this.$nextTick(() => {
            this.renderChart(this.chartData, newOptions)
          })
        }
      },
      deep: true
    }
  }
}

export default {
  name: 'PieClassificationChart',
  components: { PieChartCanvas },
  props: {
    movimentationType: {
      type: String,
      default: null,
      validator: val => !val || ['RECEITA', 'DESPESA'].includes(val)
    },
    title: {
      type: String,
      default: ''
    },
    summary: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters('movimentation', ['getSummary']),
    byClassification () {
      return this.summary && this.summary.byClassification ? this.summary.byClassification : (this.getSummary && this.getSummary.byClassification ? this.getSummary.byClassification : [])
    },
    dataByClassification () {
      const acc = {}
      const list = Array.isArray(this.byClassification) ? this.byClassification : []

      list.forEach(item => {
        // Filtrar por tipo se prop estiver definida
        if (this.movimentationType && item.type !== this.movimentationType) return
        const key = item.classificationName || 'Sem descrição'
        const value = item.total / 100 // Converter de centavos para reais
        acc[key] = (acc[key] || 0) + value
      })

      console.log(`[PieClassificationChart] ${this.movimentationType}:`, acc, 'byClassification:', this.byClassification)
      return acc
    },
    totalValue () {
      return Object.values(this.dataByClassification).reduce((sum, val) => sum + val, 0)
    },
    chartData () {
      const labels = Object.keys(this.dataByClassification)
      const values = labels.map(l => this.dataByClassification[l])
      // Fallback se vazio
      if (!labels.length) {
        return {
          labels: ['Sem dados'],
          datasets: [{ backgroundColor: ['#ccc'], data: [1] }]
        }
      }
      const baseColors = ['#1976D2', '#26A69A', '#9C27B0', '#E53935', '#FFA000', '#7CB342', '#00897B', '#5C6BC0', '#F4511E', '#6D4C41']
      const colors = labels.map((_, i) => baseColors[i % baseColors.length])
      return {
        labels,
        datasets: [
          {
            backgroundColor: colors,
            data: values
          }
        ]
      }
    },
    chartOptions () {
      const self = this
      return {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        legend: {
          position: 'bottom',
          labels: {
            generateLabels: function (chart) {
              const data = chart.data
              if (data.labels.length && data.datasets.length) {
                return data.labels.map(function (label, i) {
                  const dataset = data.datasets[0]
                  const value = dataset.data[i]
                  const percentage = self.totalValue > 0 ? ((value / self.totalValue) * 100).toFixed(1) : 0
                  return {
                    text: `${label} (${percentage}%)`,
                    fillStyle: dataset.backgroundColor[i],
                    hidden: false,
                    index: i
                  }
                })
              }
              return []
            }
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const dataset = data.datasets[tooltipItem.datasetIndex]
              const value = dataset.data[tooltipItem.index]
              const percentage = self.totalValue > 0 ? ((value / self.totalValue) * 100).toFixed(1) : 0
              const valueFormatted = Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              return `${data.labels[tooltipItem.index]}: R$ ${valueFormatted} (${percentage}%)`
            }
          }
        }
      }
    }
  }
}
</script>
<style scoped>
.pie-chart-wrapper {
  width: 100%;
  max-width: 100%;
}
.chart-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}
.chart-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
</style>
