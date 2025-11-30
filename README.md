# Movimentation Front-end

Sistema de gerenciamento financeiro pessoal desenvolvido com Vue.js e Quasar Framework.

## 📋 Descrição

Aplicação front-end para controle de movimentações financeiras (receitas e despesas), permitindo:
- Registro e edição de movimentações com classificações
- Dashboard com gráficos de pizza separados por receitas e despesas
- Filtros por período, valor, classificação, forma de pagamento e usuário
- Visualização de totais por classificação e período
- Suporte a múltiplas formas de pagamento (PIX, Dinheiro, Cartão, TED)

## 🚀 Tecnologias

- **Vue.js 2** - Framework JavaScript progressivo
- **Quasar Framework v1** - Framework de componentes UI
- **Vuex** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **Chart.js + vue-chartjs** - Visualização de dados em gráficos
- **date-fns** - Manipulação de datas
- **JWT** - Autenticação baseada em tokens

## 📦 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── classification/  # Gerenciamento de classificações
│   ├── dashboard/       # Gráficos e visualizações
│   ├── Login/          # Autenticação
│   ├── Movimentations/ # CRUD de movimentações
│   ├── plan-of-bills/  # Plano de contas
│   └── Users/          # Gerenciamento de usuários
├── pages/              # Páginas da aplicação
├── router/             # Configuração de rotas
├── store/              # Módulos Vuex (estados globais)
└── boot/               # Plugins e configurações iniciais
```

## 🔧 Instalação

### Pré-requisitos
- Node.js >= 10.18.1
- npm >= 6.13.4 ou yarn >= 1.21.1

### Passos

1. Clone o repositório:
```bash
git clone <repository-url>
cd movimentation-front-end
```

2. Instale as dependências:
```bash
yarn install
# ou
npm install
```

3. Configure as variáveis de ambiente:
   - A aplicação espera o backend em `http://localhost:3000/api/`
   - Ajuste em `src/Instances/Axios.js` se necessário

4. Inicie o servidor de desenvolvimento:
```bash
yarn start:dev
# ou
npm run start:dev
```

5. Acesse a aplicação em `http://localhost:8080`

## 🐳 Docker

Inicie a aplicação com Docker:
```bash
docker-compose up
```

## 📱 Funcionalidades

### Autenticação
- Login com email e senha
- Criação de conta
- Token JWT armazenado no localStorage

### Movimentações
- Cadastro de receitas e despesas
- Campos: data, valor, classificação, forma de pagamento
- Edição e exclusão de registros
- Filtros avançados por período, valor, classificação
- Listagem paginada (50 itens por padrão)
- Ordenação por data (mais recentes primeiro)

### Dashboard
- Filtro por mês/ano
- Gráficos de pizza separados para receitas e despesas
- Percentual de cada classificação
- Tabelas com totais por classificação
- Somatório geral de receitas e despesas

### Classificações
- Tipos: RECEITA ou DESPESA
- Descrição customizável
- Select com autocomplete/filtro
- Adição rápida via modal

### Formas de Pagamento
- MONEY (Dinheiro)
- PIX
- CREDIT_CARD (Cartão de Crédito)
- DEBIT_CARD (Cartão de Débito)
- TED

## 🔌 API Backend

A aplicação consome uma API REST com os seguintes endpoints principais:

```
POST   /api/auth/login                 # Autenticação
POST   /api/auth/register              # Registro de usuário
GET    /api/movimentations             # Lista movimentações (com filtros)
POST   /api/movimentations             # Cria movimentação
PATCH  /api/movimentations/:id         # Atualiza movimentação
DELETE /api/movimentations/:id         # Deleta movimentação
GET    /api/classifications            # Lista classificações
POST   /api/classifications            # Cria classificação
GET    /api/users                      # Lista usuários
```

### Exemplo de Payload

**POST /api/movimentations:**
```json
{
  "date": "2025-11-29T00:00:00Z",
  "value": 150.50,
  "classification": { "id": 21 },
  "payDate": "2025-11-29T00:00:00Z",
  "paymentMethod": "PIX"
}
```

## 🛠️ Scripts Disponíveis

```bash
yarn start:dev    # Inicia o servidor de desenvolvimento
yarn lint         # Executa o linter
yarn test         # Executa testes (não configurado)
```

## 📝 Licença

Projeto privado - Todos os direitos reservados

## 👤 Autor

**Breno**
- Email: brenoo194@gmail.com

---

Desenvolvido com ❤️ usando Quasar Framework
