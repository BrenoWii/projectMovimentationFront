# Correção Necessária no Backend - Endpoint de Movimentações

## Problema
O endpoint `GET /api/movimentations` está retornando apenas um array direto de movimentações, mas o front-end espera um objeto com a estrutura `{movimentations, summary}`.

## Formato Atual (Incorreto)
```json
[
  {
    "id": 1,
    "date": "2025-11-04",
    "value": 202234,
    "payDate": null,
    "paymentMethod": null,
    "classification": {
      "id": 1,
      "description": "Pagamento mensal",
      "type": "RECEITA"
    },
    "user": {
      "id": 2,
      "firstName": "Andressa",
      "lastName": "Tebas",
      "email": "andressa.tebas@gmail.com"
    }
  },
  {
    "id": 2,
    "date": "2025-11-04",
    "value": -12060,
    "classification": {
      "id": 2,
      "description": "Internet",
      "type": "DESPESA"
    }
  }
]
```

## Formato Esperado (Correto)
```json
{
  "movimentations": [
    {
      "id": 1,
      "date": "2025-11-04",
      "value": 202234,
      "payDate": null,
      "paymentMethod": null,
      "classification": {
        "id": 1,
        "description": "Pagamento mensal",
        "type": "RECEITA"
      },
      "planOfBill": {
        "id": 1,
        "description": "Contas a Receber"
      },
      "user": {
        "id": 2,
        "firstName": "Andressa",
        "lastName": "Tebas"
      }
    },
    {
      "id": 2,
      "date": "2025-11-04",
      "value": -12060,
      "classification": {
        "id": 2,
        "description": "Internet",
        "type": "DESPESA"
      },
      "planOfBill": {
        "id": 2,
        "description": "Despesas Fixas"
      }
    }
  ],
  "summary": {
    "byClassification": [
      {
        "classificationId": 1,
        "classificationName": "Pagamento mensal",
        "type": "RECEITA",
        "total": 202234,
        "count": 1
      },
      {
        "classificationId": 2,
        "classificationName": "Internet",
        "type": "DESPESA",
        "total": 12060,
        "count": 1
      }
    ],
    "byPlanOfBills": [
      {
        "planOfBillId": 1,
        "planOfBillName": "Contas a Receber",
        "total": 202234,
        "count": 1
      },
      {
        "planOfBillId": 2,
        "planOfBillName": "Despesas Fixas",
        "total": 12060,
        "count": 1
      }
    ]
  }
}
```

## O Que Precisa Ser Feito

### 1. Alterar a Resposta do Endpoint
O endpoint `GET /api/movimentations` deve retornar um objeto com duas propriedades principais:
- `movimentations`: Array com as movimentações (estrutura atual)
- `summary`: Objeto com agregações e estatísticas

### 2. Estrutura do Summary

#### byClassification
Agrupamento por classificação contendo:
- `classificationId`: ID da classificação
- `classificationName`: Nome/descrição da classificação
- `type`: Tipo da classificação (RECEITA ou DESPESA)
- `total`: Soma dos **valores absolutos** (sem sinal negativo) em centavos
- `count`: Quantidade de movimentações nessa classificação

#### byPlanOfBills
Agrupamento por plano de contas contendo:
- `planOfBillId`: ID do plano de contas
- `planOfBillName`: Nome/descrição do plano de contas
- `total`: Soma dos **valores absolutos** (sem sinal negativo) em centavos
- `count`: Quantidade de movimentações nesse plano

### 3. Observações Importantes

- **Valores no summary devem ser absolutos**: Use `Math.abs(value)` ao calcular os totais
- **Os valores já estão em centavos**: Não precisa converter, mantenha como estão
- **Incluir planOfBill nas movimentações**: Se possível, incluir o relacionamento com plano de contas em cada movimentação
- **Remover informações sensíveis**: Não retornar o campo `password` do usuário (como está acontecendo atualmente)

### 4. Exemplo de Lógica (Pseudocódigo)

```typescript
async getMovimentations(filters) {
  const movimentations = await this.movimentationRepository.find(filters);
  
  const byClassification = {};
  const byPlanOfBills = {};
  
  movimentations.forEach(mov => {
    const absValue = Math.abs(mov.value);
    
    // Agrupar por classificação
    const classId = mov.classification.id;
    if (!byClassification[classId]) {
      byClassification[classId] = {
        classificationId: classId,
        classificationName: mov.classification.description,
        type: mov.classification.type,
        total: 0,
        count: 0
      };
    }
    byClassification[classId].total += absValue;
    byClassification[classId].count += 1;
    
    // Agrupar por plano de contas
    if (mov.planOfBill) {
      const planId = mov.planOfBill.id;
      if (!byPlanOfBills[planId]) {
        byPlanOfBills[planId] = {
          planOfBillId: planId,
          planOfBillName: mov.planOfBill.description,
          total: 0,
          count: 0
        };
      }
      byPlanOfBills[planId].total += absValue;
      byPlanOfBills[planId].count += 1;
    }
  });
  
  return {
    movimentations,
    summary: {
      byClassification: Object.values(byClassification),
      byPlanOfBills: Object.values(byPlanOfBills)
    }
  };
}
```

### 5. Segurança
**IMPORTANTE**: Remover o campo `password` do objeto `user` antes de retornar. Atualmente o password hash está sendo exposto na resposta!

```typescript
// Exemplo de como remover dados sensíveis
movimentations = movimentations.map(mov => ({
  ...mov,
  user: {
    id: mov.user.id,
    firstName: mov.user.firstName,
    lastName: mov.user.lastName,
    email: mov.user.email
    // NÃO incluir password!
  }
}));
```

## Resultado Esperado
Após a correção, o dashboard e a página de movimentações do front-end funcionarão corretamente, exibindo:
- Lista de movimentações
- Totais por classificação
- Totais por plano de contas
- Gráficos de receitas e despesas
