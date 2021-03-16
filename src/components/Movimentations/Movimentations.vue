
<template>
<div >
  <div class="q-pa-md">
     <q-table
      title="Treats"
      :data="getMovimentations"
      :columns="columns"
      row-key="name"
    >

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.date"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

    <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-toggle v-model="props.expand" checked-icon="add" unchecked-icon="remove" />
          </q-td>

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
          </q-td>
        </q-tr>
      </template>

    </q-table>
  </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      columns: [
        {
          name: 'date',
          required: true,
          label: 'data',
          align: 'left',
          field: row => row.date,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'payDate', align: 'center', label: 'Data de pagamento', field: 'calories', sortable: true },
        { name: 'planOfBill', label: 'Plano de Contas', field: row => row.planOfBill.description, sortable: true, style: 'width: 10px' },
        { name: 'value', label: 'Valor', field: 'value' }
      ],
      data: this.getMovimentations
    }
  },
  computed: {
    ...mapGetters('movimentation', ['getMovimentations'])
  }
}
</script>
