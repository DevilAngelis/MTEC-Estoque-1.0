# 🚀 Guia de Deploy no Railway - MTec Estoque

Este guia fornece instruções completas para fazer deploy do aplicativo MTec Estoque no Railway.

## 📋 Pré-requisitos

1. **Conta no Railway**: Crie uma conta em [railway.app](https://railway.app)
2. **Repositório GitHub**: O código deve estar no GitHub (já configurado)
3. **Banco de Dados MySQL**: Você precisará de um banco MySQL (pode usar o Railway MySQL ou externo)

## 🔧 Configuração Inicial

### 1. Conectar Repositório ao Railway

1. Acesse [railway.app](https://railway.app) e faça login
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha o repositório: `DevilAngelis/MTEC-Estoque-1.0`
5. Railway detectará automaticamente o `Dockerfile` ou `railway.json`

### 2. Configurar Variáveis de Ambiente

No Railway, vá em **Variables** e adicione as seguintes variáveis:

#### Variáveis Obrigatórias

```env
# Banco de Dados MySQL
DATABASE_URL=mysql://usuario:senha@host:porta/nome_do_banco

# Segurança JWT
JWT_SECRET=sua-chave-secreta-jwt-muito-segura-aqui

# Ambiente
NODE_ENV=production
PORT=3000
```

#### Variáveis Opcionais (se usar OAuth Manus)

```env
# OAuth Manus
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://oauth-server-url
VITE_OAUTH_PORTAL_URL=https://oauth-portal-url
OWNER_OPEN_ID=seu-open-id
OWNER_NAME=Seu Nome

# Manus API (opcional)
BUILT_IN_FORGE_API_URL=https://api-url
BUILT_IN_FORGE_API_KEY=sua-api-key
```

### 3. Configurar Banco de Dados MySQL

#### Opção A: MySQL do Railway (Recomendado)

1. No projeto Railway, clique em **"+ New"**
2. Selecione **"Database"** → **"Add MySQL"**
3. Railway criará automaticamente um banco MySQL
4. Copie a variável `DATABASE_URL` que aparece automaticamente
5. Adicione essa variável nas **Variables** do seu serviço

#### Opção B: MySQL Externo

Se você já tem um MySQL externo, apenas adicione a `DATABASE_URL` nas variáveis.

### 4. Executar Migrações do Banco

Após configurar o banco, você precisa executar as migrações:

**Opção 1: Via Railway CLI**

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Fazer login
railway login

# Conectar ao projeto
railway link

# Executar migrações
railway run pnpm db:push
```

**Opção 2: Via Terminal do Railway**

1. No Railway, vá em seu serviço
2. Clique em **"View Logs"**
3. Clique em **"Deploy Logs"** → **"Shell"**
4. Execute: `pnpm db:push`

## 🐳 Configuração do Dockerfile

O projeto já possui um `Dockerfile` otimizado:

```dockerfile
FROM node:22-alpine
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm@8.15.4

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml* ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código
COPY . .

# Build do servidor
RUN pnpm build

# Expor porta
EXPOSE 3000

# Iniciar servidor
CMD ["pnpm", "start"]
```

## 📝 Configuração do Railway (railway.json)

O arquivo `railway.json` está configurado para usar Dockerfile:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  }
}
```

**Nota**: O Railway detectará automaticamente o `Dockerfile` e o usará. Se preferir usar Dockerfile explicitamente, você pode remover o `railway.json` ou alterar para `"builder": "DOCKERFILE"`.

## 🚀 Processo de Deploy

### Deploy Automático (Recomendado)

1. **Conecte o repositório** ao Railway (passo 1 acima)
2. Railway detectará automaticamente o `Dockerfile`
3. Configure as **variáveis de ambiente**
4. Railway fará o deploy automaticamente a cada push no `main`

### Deploy Manual

1. No Railway, clique em **"Deploy"**
2. Selecione o branch (geralmente `main`)
3. Railway construirá e fará o deploy automaticamente

## ✅ Verificação do Deploy

Após o deploy, verifique:

1. **Logs do Railway**: Vá em **"View Logs"** e verifique se aparece:
   ```
   [api] server listening on port 3000
   ```

2. **Health Check**: Acesse `https://seu-projeto.up.railway.app/api/health`
   - Deve retornar: `{"ok":true,"timestamp":...,"message":"API MTec Estoque está operacional"}`

3. **Página Inicial**: Acesse `https://seu-projeto.up.railway.app`
   - Deve mostrar a página de boas-vindas do MTec Estoque

## 🔗 Configurar Domínio Personalizado (Opcional)

1. No Railway, vá em **Settings** → **Networking**
2. Clique em **"Generate Domain"** para obter um domínio `.up.railway.app`
3. Ou configure um domínio personalizado clicando em **"Custom Domain"**

## 🔄 Atualizar Variáveis de Ambiente

Para atualizar variáveis sem fazer novo deploy:

1. Vá em **Variables**
2. Edite ou adicione as variáveis necessárias
3. Railway reiniciará o serviço automaticamente

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

- ✅ Verifique se `DATABASE_URL` está configurada corretamente
- ✅ Verifique se o banco MySQL está acessível
- ✅ Execute as migrações: `pnpm db:push`

### Erro: "Port already in use"

- ✅ Railway define `PORT` automaticamente, não precisa configurar manualmente
- ✅ O servidor já está configurado para usar `process.env.PORT`

### Erro: "Build failed"

- ✅ Verifique os logs do build no Railway
- ✅ Certifique-se de que `pnpm-lock.yaml` está commitado
- ✅ Verifique se todas as dependências estão no `package.json`

### Erro: "Module not found"

- ✅ Verifique se o build está executando: `pnpm build`
- ✅ Certifique-se de que o arquivo `dist/index.js` está sendo gerado

### Servidor não inicia

- ✅ Verifique os logs: `railway logs` ou no dashboard
- ✅ Verifique se `NODE_ENV=production` está configurado
- ✅ Verifique se `JWT_SECRET` está configurado

## 📊 Monitoramento

### Ver Logs em Tempo Real

```bash
railway logs
```

Ou no dashboard do Railway: **View Logs**

### Métricas

O Railway fornece métricas básicas:
- **CPU Usage**
- **Memory Usage**
- **Network Traffic**

Acesse em: **Metrics** no dashboard

## 🔐 Segurança

### Variáveis Sensíveis

**NUNCA** commite variáveis sensíveis no código:
- ✅ Use sempre variáveis de ambiente do Railway
- ✅ Adicione `.env` ao `.gitignore` (já está configurado)
- ✅ Use `JWT_SECRET` forte e único

### CORS

O servidor está configurado para aceitar requisições de qualquer origem em desenvolvimento. Para produção, considere restringir:

```typescript
// server/_core/index.ts
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
```

## 📱 Configurar App Mobile para Produção

Após o deploy, atualize as variáveis no app mobile:

```env
EXPO_PUBLIC_API_BASE_URL=https://seu-projeto.up.railway.app
```

Ou configure no `app.config.ts`:

```typescript
const config: ExpoConfig = {
  // ...
  extra: {
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://seu-projeto.up.railway.app',
  },
};
```

## 🎯 Checklist de Deploy

Antes de considerar o deploy completo:

- [ ] ✅ Repositório conectado ao Railway
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Banco de dados MySQL configurado
- [ ] ✅ Migrações executadas (`pnpm db:push`)
- [ ] ✅ Build executando com sucesso
- [ ] ✅ Servidor iniciando corretamente (ver logs)
- [ ] ✅ Health check respondendo (`/api/health`)
- [ ] ✅ Página inicial carregando (`/`)
- [ ] ✅ API tRPC funcionando (`/api/trpc`)
- [ ] ✅ Domínio configurado (opcional)

## 💰 Custos

O Railway oferece:
- **Plano Hobby**: $5/mês com $5 de crédito grátis
- **Plano Pro**: $20/mês com mais recursos

**Nota**: O plano gratuito pode ter limitações. Verifique os planos em [railway.app/pricing](https://railway.app/pricing)

## 📚 Recursos Adicionais

- [Documentação do Railway](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Exemplos de Deploy](https://docs.railway.app/examples)

---

**Última atualização:** 2026-02-20
**Versão do App:** 1.0.0
