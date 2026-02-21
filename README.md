# MTec Estoque - Controle de Estoque Pro

Sistema de controle de estoque com login, isolamento por usuário e interface desktop (Electron).

## Requisitos

- Node.js 18+
- pnpm 8+
- MySQL 8+

## Configuração

1. **Clone e instale dependências:**
   ```bash
   pnpm install
   ```

2. **Configure o banco de dados:**
   - Copie `.env.example` para `.env`
   - Ajuste `DATABASE_URL` e `JWT_SECRET`

3. **Execute a migração:**
   ```bash
   pnpm db:push
   ```

## Uso

### Desenvolvimento

```bash
pnpm dev
```

Abre o app em http://localhost:8081 (web) e a API em http://localhost:3000.

### Produção (servidor)

```bash
pnpm build
pnpm start
```

### Executável Windows (.exe)

```bash
pnpm build:electron:installer
```

O instalador será gerado em `release/`.

### Electron (desenvolvimento)

```bash
pnpm build
pnpm build:web
pnpm electron:start
```

## Funcionalidades

- **Login/Cadastro** – Email e senha, dados isolados por usuário
- **Dashboard** – Dashboard com métricas
- **Materiais** – Cadastro, edição e exclusão
- **Categorias** – Categorias de materiais
- **Movimentações** – Entradas e saídas
- **Relatórios** – Filtros e exportação
- **Configurações** – Tema e logout

## Estrutura

```
app/          # Telas (Expo Router)
server/       # API (Express + tRPC)
drizzle/      # Schema e migrações
electron/     # App desktop
```
