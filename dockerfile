# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json e yarn.lock
COPY package.json yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação com API_BASE_URL
ARG API_BASE_URL=http://host.docker.internal:3000/api/
ENV API_BASE_URL=${API_BASE_URL}
RUN yarn build

# Stage 2: Production
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]