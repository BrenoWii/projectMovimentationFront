<template>
  <q-page padding>
    <!-- Filtro de Período -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-4">
            <q-input
              v-model="periodMonth"
              filled
              dense
              label="Mês"
              type="month"
              @input="applyPeriodFilter"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-8">
            <div class="text-caption text-grey-7">
              Período: {{ periodDisplay }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Gráficos lado a lado -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <PieClassificationChart :movimentation-type="'RECEITA'" :filtered-data="filteredMovimentations" title="Receitas por Classificação" />
      </div>
      <div class="col-12 col-md-6">
        <PieClassificationChart :movimentation-type="'DESPESA'" :filtered-data="filteredMovimentations" title="Despesas por Classificação" />
      </div>
    </div>

    <!-- Gráfico de Plano de Contas -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Distribuição por Plano de Contas</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="planOfBillsData.length > 0">
              <PiePlanOfBillsChart :summary="summary" />
            </div>
            <div v-else class="text-center text-grey-6 q-pa-md">
              Nenhum dado disponível para exibir
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Tabelas com totais embaixo -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 text-positive">Receitas por Classificação</div>
          </q-card-section>
          <q-separator />
          <q-list dense>
            <q-item v-for="(val,key) in sortedReceitasList" :key="key">
              <q-item-section>{{ key }}</q-item-section>
              <q-item-section side class="text-right">{{ formatCurrency(val * 100) }}</q-item-section>
            </q-item>
            <q-separator />
            <q-item>
              <q-item-section><strong>Total Receitas</strong></q-item-section>
              <q-item-section side class="text-right text-positive"><strong>{{ formatCurrency(totalReceitas * 100) }}</strong></q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 text-negative">Despesas por Classificação</div>
          </q-card-section>
          <q-separator />
          <q-list dense>
            <q-item v-for="(val,key) in sortedDespesasList" :key="key">
              <q-item-section>{{ key }}</q-item-section>
              <q-item-section side class="text-right">{{ formatCurrency(val * 100) }}</q-item-section>
            </q-item>
            <q-separator />
            <q-item>
              <q-item-section><strong>Total Despesas</strong></q-item-section>
              <q-item-section side class="text-right text-negative"><strong>{{ formatCurrency(totalDespesas * 100) }}</strong></q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- Tabela de Plano de Contas -->
    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Resumo por Plano de Contas</div>
          </q-card-section>
          <q-separator />
          <q-list dense>
            <q-item v-for="item in sortedPlanOfBillsList" :key="item.planOfBillId">
              <q-item-section>{{ item.planOfBillName }}</q-item-section>
              <q-item-section side class="text-right">{{ formatCurrency(item.total) }}</q-item-section>
              <q-item-section side class="text-right text-grey-7">{{ item.count }} mov.</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
import PieClassificationChart from '../../components/dashboard/PieClassificationChart.vue'
import PiePlanOfBillsChart from '../../components/dashboard/PiePlanOfBillsChart.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'DashboardPage',
  components: { PieClassificationChart, PiePlanOfBillsChart },
  data () {
    return {
      periodMonth: this.getCurrentYearMonth()
    }
  },
  created () {
    this.ensureMovimentationsLoaded()
  },
  computed: {
    ...mapGetters('movimentation', ['getMovimentations', 'getSummary']),
    ...mapGetters('authentication', ['getUser']),
    userId () {
      return this.getUser && this.getUser.user && this.getUser.user.id ? this.getUser.user.id : null
    },
    summary () {
      return this.getSummary || {}
    },
    periodDisplay () {
      if (!this.periodMonth) return 'Todos os períodos'
      const [year, month] = this.periodMonth.split('-')
      const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
      return `${months[parseInt(month) - 1]} de ${year}`
    },
    filteredMovimentations () {
      const list = Array.isArray(this.getMovimentations) ? this.getMovimentations : []
      if (!this.periodMonth) return list
      const [year, month] = this.periodMonth.split('-')
      return list.filter(row => {
        const dateStr = row && row.date
        if (!dateStr) return false
        const date = new Date(dateStr)
        return date.getFullYear() === parseInt(year) && (date.getMonth() + 1) === parseInt(month)
      })
    },
    dataByClassificationType () {
      const receitas = {}
      const despesas = {}
      const list = this.filteredMovimentations
      list.forEach(row => {
        const classification = (row && row.classification) || (row && row.planOfBill && row.planOfBill.classification) || null
        if (!classification) return
        const key = classification.description || 'Sem descrição'
        const type = classification.type || ''
        const rawVal = row && row.value
        const num = typeof rawVal === 'number' ? rawVal : Number(rawVal)
        if (!Number.isFinite(num)) return
        const realVal = Math.abs(num) / 100
        if (type === 'RECEITA') {
          receitas[key] = (receitas[key] || 0) + realVal
        } else if (type === 'DESPESA') {
          despesas[key] = (despesas[key] || 0) + realVal
        }
      })
      return { receitas, despesas }
    },
    sortedReceitasList () {
      return Object.fromEntries(
        Object.entries(this.dataByClassificationType.receitas).sort((a, b) => b[1] - a[1])
      )
    },
    sortedDespesasList () {
      return Object.fromEntries(
        Object.entries(this.dataByClassificationType.despesas).sort((a, b) => b[1] - a[1])
      )
    },
    totalReceitas () {
      return Object.values(this.dataByClassificationType.receitas).reduce((acc, val) => acc + val, 0)
    },
    totalDespesas () {
      return Object.values(this.dataByClassificationType.despesas).reduce((acc, val) => acc + val, 0)
    },
    sortedPlanOfBillsList () {
      const byPlanOfBills = this.summary.byPlanOfBills || []
      return byPlanOfBills.slice().sort((a, b) => b.total - a.total)
    },
    planOfBillsData () {
      const byPlanOfBills = this.summary.byPlanOfBills || []
      return byPlanOfBills.filter(item => item.total > 0)
    }
  },
  methods: {
    getCurrentYearMonth () {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      return `${year}-${month}`
    },
    applyPeriodFilter () {
      // Forçar reatividade ao alterar o período
      this.$forceUpdate()
    },
    formatCurrency (val) {
      if (!Number.isFinite(val)) return '-'
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val / 100)
    },
    ensureMovimentationsLoaded () {
      const list = this.getMovimentations
      const params = this.userId ? { userId: this.userId } : {}
      if (!Array.isArray(list) || list.length === 0) {
        this.$store.dispatch('movimentation/getMovimentations', params).catch(err => {
          console.error('Falha ao carregar movimentações para dashboard', err)
        })
      }
    }
  }
}
</script>
