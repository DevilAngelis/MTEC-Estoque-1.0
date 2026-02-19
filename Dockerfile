FROM node:22-alpine

WORKDIR /app

# Instalar versão correta do pnpm
RUN npm install -g pnpm@8.15.4

# Copiar arquivos essenciais primeiro (cache inteligente)
COPY package.json pnpm-lock.yaml* ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar resto do projeto
COPY . .

# Build (se for Next.js)
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
