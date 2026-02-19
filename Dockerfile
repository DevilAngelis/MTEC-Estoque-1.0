FROM node:22-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar arquivos
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .

# Build
RUN pnpm run build

# Expor porta
EXPOSE 3000

# Start
CMD ["pnpm", "start"]
