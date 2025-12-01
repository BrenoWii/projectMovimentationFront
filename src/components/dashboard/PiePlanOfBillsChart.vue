<script>
import { Pie } from 'vue-chartjs'

export default {
  name: 'PiePlanOfBillsChart',
  extends: Pie,
  props: {
    summary: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  computed: {
    planOfBillsData () {
      const byPlanOfBills = this.summary.byPlanOfBills || []
      console.log('PiePlanOfBillsChart - summary:', this.summary)
      console.log('PiePlanOfBillsChart - byPlanOfBills:', byPlanOfBills)
      return byPlanOfBills.filter(item => item.total > 0)
    },
    totalValue () {
      return this.planOfBillsData.reduce((acc, item) => acc + item.total, 0)
    },
    chartData () {
      const data = this.planOfBillsData
      const labels = data.map(item => item.planOfBillName || 'Sem plano')
      const values = data.map(item => item.total / 100)
      const backgroundColors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#E7E9ED',
        '#C9CBCF',
        '#4BC0C0',
        '#FF9F40'
      ]

      return {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: backgroundColors.slice(0, data.length)
        }]
      }
    },
    chartOptions () {
      return {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1.5,
        legend: {
          position: 'right',
          labels: {
            generateLabels: (chart) => {
              const data = chart.data
              if (data.labels.length && data.datasets.length) {
                const dataset = data.datasets[0]
                const sum = dataset.data.reduce((acc, val) => acc + val, 0)
                return data.labels.map((label, i) => {
                  const value = dataset.data[i]
                  const percentage = sum > 0 ? ((value / sum) * 100).toFixed(1) : 0
                  return {
                    text: `${label}: ${percentage}%`,
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
              const label = data.labels[tooltipItem.index] || ''
              const value = data.datasets[0].data[tooltipItem.index]
              const formatted = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(value)
              return `${label}: ${formatted}`
            }
          }
        }
      }
    }
  },
  watch: {
    summary: {
      handler () {
        this.$data._chart.destroy()
        this.renderChart(this.chartData, this.chartOptions)
      },
      deep: true
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.chartOptions)
  }
}
</script>

<style scoped>
</style>
