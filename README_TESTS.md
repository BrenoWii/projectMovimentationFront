# Testes da Aplicação

## Estrutura de Testes

```
tests/
├── setup.js                          # Configuração global dos testes
├── unit/
│   ├── store/
│   │   ├── authentication.spec.js   # Testes de autenticação
│   │   └── movimentation.spec.js    # Testes de movimentações
│   ├── router/
│   │   └── guards.spec.js           # Testes de guards do router
│   └── utils/
│       └── currency.spec.js         # Testes de formatação de moeda
```

## Instalação

Para adicionar os testes ao projeto, instale as dependências:

```bash
yarn add -D vitest @vitest/ui happy-dom @vue/test-utils
```

## Executar Testes

### Rodar todos os testes
```bash
yarn test
```

### Rodar testes em modo watch
```bash
yarn test:watch
```

### Ver interface gráfica dos testes
```bash
yarn test:ui
```

### Gerar relatório de cobertura
```bash
yarn test:coverage
```

## Scripts do package.json

Adicione os seguintes scripts ao `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Cobertura Atual

### Módulos Testados

#### ✅ Authentication Store
- Login com sucesso
- Login com credenciais inválidas
- Validação de accessToken
- Armazenamento no localStorage
- Tratamento de erros

#### ✅ Router Guards
- Acesso a rotas públicas
- Bloqueio de rotas privadas sem autenticação
- Validação de token
- Tratamento de JSON inválido no localStorage
- Logout e limpeza de dados

#### ✅ Currency Utils
- Formatação de valores em centavos para reais
- Conversão de strings para centavos
- Tratamento de valores negativos
- Validação de entradas inválidas

#### ✅ Movimentation Store
- Busca de movimentações com summary
- Filtragem por data, valor, usuário
- Tratamento de parâmetros vazios
- Validação do formato da API

## Próximos Passos

### Testes a Serem Implementados

1. **Componentes Vue**
   - `Movimentations.vue`
   - `MovimentationsForm.vue`
   - `ClassificationSelect.vue`
   - `PiePlanOfBillsChart.vue`

2. **Store Modules**
   - `import/` actions e mutations
   - `classification/` CRUD operations
   - `planOfBills/` CRUD operations

3. **Integração**
   - Fluxo completo de login
   - Criação de movimentação
   - Sistema de importação CSV

4. **E2E Tests (Cypress/Playwright)**
   - Jornada do usuário completa
   - Testes de navegação
   - Validação de formulários

## Boas Práticas

1. **Isolar dependências** - Use mocks para Axios, Quasar, etc.
2. **Testar comportamento** - Não teste implementação, teste o resultado
3. **Cobertura mínima** - Alvo de 80% de cobertura
4. **Testes descritivos** - Nomes claros do que está sendo testado
5. **Arrange-Act-Assert** - Estruture os testes em 3 partes claras

## Exemplo de Teste

```javascript
import { describe, it, expect, vi } from 'vitest'

describe('MinhaFuncionalidade', () => {
  it('deve fazer algo específico quando chamada', () => {
    // Arrange - Preparar dados
    const input = { valor: 100 }
    
    // Act - Executar ação
    const resultado = minhaFuncao(input)
    
    // Assert - Verificar resultado
    expect(resultado).toBe(esperado)
  })
})
```

## Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/)
