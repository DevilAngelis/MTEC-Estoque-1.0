# 🧪 Guia de Teste - MTec Estoque

Este guia fornece instruções completas para testar o aplicativo antes de gerar o APK.

## 📋 Pré-requisitos

### 1. Dependências Instaladas
```bash
pnpm install
```

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL=mysql://usuario:senha@localhost:3306/estoque

# Segurança
JWT_SECRET=sua-chave-secreta-jwt-aqui

# OAuth (opcional - apenas se usar autenticação Manus)
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://oauth-server-url
VITE_OAUTH_PORTAL_URL=https://oauth-portal-url
OWNER_OPEN_ID=seu-open-id
OWNER_NAME=Seu Nome

# Expo Public (para o app mobile)
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_APP_ID=seu-app-id
EXPO_PUBLIC_OAUTH_PORTAL_URL=https://oauth-portal-url
EXPO_PUBLIC_OAUTH_SERVER_URL=https://oauth-server-url
EXPO_PUBLIC_OWNER_OPEN_ID=seu-open-id
EXPO_PUBLIC_OWNER_NAME=Seu Nome
```

### 3. Banco de Dados

Certifique-se de que o MySQL está rodando e execute as migrações:

```bash
pnpm db:push
```

## 🔧 Verificações Antes de Testar

### 1. Verificar Compilação TypeScript
```bash
pnpm check
```
✅ Deve passar sem erros

### 2. Verificar Linter
```bash
pnpm lint
```
✅ Deve passar sem erros críticos

### 3. Compilar o Servidor
```bash
pnpm build
```
✅ Deve gerar `dist/index.js` sem erros

## 🚀 Como Testar

### Opção 1: Teste Completo (Servidor + App)

#### Passo 1: Iniciar o Servidor
```bash
# Terminal 1 - Servidor em modo desenvolvimento
pnpm dev:server
```
✅ Aguarde a mensagem: `[api] server listening on port 3000`

#### Passo 2: Iniciar o Metro Bundler
```bash
# Terminal 2 - Metro Bundler
pnpm dev:metro
```
✅ Aguarde o QR code aparecer no terminal

#### Passo 3: Testar no Dispositivo/Emulador

**Android:**
```bash
pnpm android
```
Ou escaneie o QR code com o app Expo Go instalado no seu dispositivo Android.

**iOS:**
```bash
pnpm ios
```
Ou escaneie o QR code com o app Expo Go instalado no seu dispositivo iOS.

**Web:**
O Metro Bundler abrirá automaticamente no navegador em `http://localhost:8081`

### Opção 2: Teste Apenas do Servidor

```bash
# Compilar
pnpm build

# Iniciar servidor em produção
pnpm start
```

✅ Verifique se o servidor está respondendo:
- Acesse: `http://localhost:3000`
- Deve mostrar a página de boas-vindas do MTec Estoque
- Acesse: `http://localhost:3000/api/health`
- Deve retornar: `{"ok":true,"timestamp":...,"message":"API MTec Estoque está operacional"}`

## 📱 Testes Funcionais

### 1. Teste de Conexão com API

1. Abra o aplicativo
2. Verifique se consegue se conectar ao servidor
3. Verifique se não há erros de conexão no console

### 2. Teste de Autenticação (se configurado)

1. Tente fazer login
2. Verifique se o token de sessão é salvo corretamente
3. Verifique se as requisições subsequentes incluem o token

### 3. Teste de Categorias

1. Navegue até a seção de Categorias
2. Crie uma nova categoria
3. Liste todas as categorias
4. Edite uma categoria existente
5. Delete uma categoria (se permitido)

### 4. Teste de Materiais

1. Navegue até a seção de Materiais
2. Crie um novo material
3. Liste todos os materiais
4. Edite um material existente
5. Verifique se a quantidade está sendo atualizada corretamente
6. Delete um material (se permitido)

### 5. Teste de Movimentações

1. Navegue até a seção de Movimentações
2. Registre uma entrada de material
3. Registre uma saída de material
4. Verifique se o estoque está sendo atualizado automaticamente
5. Liste todas as movimentações
6. Filtre movimentações por data
7. Filtre movimentações por material

### 6. Teste de Relatórios

1. Navegue até a seção de Relatórios
2. Gere um relatório PDF
3. Exporte dados em CSV
4. Verifique se os filtros de data funcionam
5. Verifique se os filtros de material funcionam

### 7. Teste de Dashboard

1. Verifique se o dashboard carrega corretamente
2. Verifique se as métricas estão sendo exibidas
3. Verifique se os gráficos estão funcionando (se houver)

## 🐛 Verificação de Erros Comuns

### Erro: "Cannot connect to server"
- ✅ Verifique se o servidor está rodando na porta 3000
- ✅ Verifique se `EXPO_PUBLIC_API_BASE_URL` está configurado corretamente
- ✅ Verifique se não há firewall bloqueando a conexão

### Erro: "Database connection failed"
- ✅ Verifique se o MySQL está rodando
- ✅ Verifique se `DATABASE_URL` está correto no `.env`
- ✅ Execute `pnpm db:push` para criar as tabelas

### Erro: "OAuth not configured"
- ⚠️ Este é apenas um aviso se você não está usando OAuth
- ✅ Se precisar de OAuth, configure as variáveis relacionadas

### Erro: "Module not found"
- ✅ Execute `pnpm install` novamente
- ✅ Verifique se todas as dependências estão instaladas

## 📊 Checklist de Teste

Antes de gerar o APK, certifique-se de que:

- [ ] ✅ Compilação TypeScript passa (`pnpm check`)
- [ ] ✅ Servidor inicia sem erros (`pnpm start`)
- [ ] ✅ App conecta ao servidor corretamente
- [ ] ✅ Todas as telas carregam sem erros
- [ ] ✅ CRUD de Categorias funciona
- [ ] ✅ CRUD de Materiais funciona
- [ ] ✅ CRUD de Movimentações funciona
- [ ] ✅ Relatórios são gerados corretamente
- [ ] ✅ Dashboard exibe dados corretamente
- [ ] ✅ Navegação entre telas funciona
- [ ] ✅ Dados persistem no banco de dados
- [ ] ✅ Validações de formulários funcionam
- [ ] ✅ Mensagens de erro são exibidas adequadamente
- [ ] ✅ App funciona em modo offline (se implementado)

## 🏗️ Gerar APK para Teste

### Pré-requisitos para Build

1. **Instalar EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Fazer login no Expo:**
```bash
eas login
```

3. **Configurar projeto (se necessário):**
```bash
eas build:configure
```

### Gerar APK de Desenvolvimento

```bash
# Build para Android (APK de desenvolvimento)
eas build --platform android --profile development

# Ou usar Expo local build (requer Android Studio)
npx expo run:android
```

### Gerar APK de Produção

```bash
# Build para Android (APK/AAB de produção)
eas build --platform android --profile production
```

## 🔍 Logs e Debug

### Ver logs do servidor
Os logs do servidor aparecem no terminal onde você executou `pnpm dev:server` ou `pnpm start`

### Ver logs do app mobile
```bash
# Android
npx react-native log-android

# iOS
npx react-native log-ios
```

### Ver logs do Metro Bundler
Os logs aparecem no terminal onde você executou `pnpm dev:metro`

## 📝 Notas Importantes

1. **Variáveis de Ambiente**: Certifique-se de que todas as variáveis necessárias estão configuradas antes de testar
2. **Banco de Dados**: O banco deve estar acessível e as migrações devem estar aplicadas
3. **Portas**: O servidor usa a porta 3000 e o Metro usa a porta 8081 por padrão
4. **CORS**: O servidor está configurado para aceitar requisições de qualquer origem em desenvolvimento
5. **Produção**: Antes de gerar o APK de produção, configure adequadamente as variáveis de ambiente de produção

## 🆘 Suporte

Se encontrar problemas durante os testes:

1. Verifique os logs do servidor e do app
2. Verifique se todas as dependências estão instaladas
3. Verifique se o banco de dados está acessível
4. Verifique se as variáveis de ambiente estão configuradas corretamente
5. Tente limpar o cache: `pnpm clean` (se disponível) ou `rm -rf node_modules && pnpm install`

---

**Última atualização:** 2026-02-20
**Versão do App:** 1.0.0
