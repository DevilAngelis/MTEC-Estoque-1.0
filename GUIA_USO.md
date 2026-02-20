# 📱 Guia de Uso - MTec Estoque

Este guia explica como usar o aplicativo MTec Estoque na prática, tanto pela interface web quanto pelo app mobile.

## 🌐 Como Acessar o Aplicativo

### Opção 1: Versão Web (Recomendado para começar)

O aplicativo está rodando no Railway e pode ser acessado em:

**URL:** `https://mtec-estoque-1-0-production.up.railway.app`

1. Abra seu navegador
2. Acesse a URL acima
3. Você verá a página inicial com informações sobre o sistema

### Opção 2: App Mobile (Android/iOS)

#### Pré-requisitos:
- App **Expo Go** instalado no seu dispositivo
  - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

#### Como Conectar:

1. **Inicie o servidor localmente:**
   ```bash
   pnpm dev:server
   ```

2. **Inicie o Metro Bundler:**
   ```bash
   pnpm dev:metro
   ```

3. **Escaneie o QR Code:**
   - Abra o Expo Go no seu dispositivo
   - Toque em "Scan QR Code"
   - Escaneie o QR code que aparece no terminal
   - O app será carregado no seu dispositivo

## 🎯 Funcionalidades Principais

O aplicativo possui 5 seções principais acessíveis pela barra de navegação inferior:

### 1. 🏠 Home (Dashboard)
- Visão geral do estoque
- Métricas e estatísticas
- Acesso rápido às funcionalidades principais

### 2. 📦 Materiais
- **Criar Material:**
  1. Toque em "Adicionar Material"
  2. Preencha: Nome, Descrição, Categoria, Quantidade, Unidade
  3. Toque em "Salvar"

- **Listar Materiais:**
  - Visualize todos os materiais cadastrados
  - Busque por nome ou categoria
  - Veja quantidade disponível em tempo real

- **Editar Material:**
  1. Toque no material desejado
  2. Altere os dados necessários
  3. Toque em "Salvar"

- **Deletar Material:**
  1. Toque no material
  2. Toque em "Deletar"
  3. Confirme a ação

### 3. 🔄 Movimentações
- **Registrar Entrada:**
  1. Toque em "Nova Movimentação"
  2. Selecione "Entrada"
  3. Escolha o material
  4. Informe a quantidade
  5. Adicione um motivo (opcional)
  6. Toque em "Registrar"

- **Registrar Saída:**
  1. Toque em "Nova Movimentação"
  2. Selecione "Saída"
  3. Escolha o material
  4. Informe a quantidade (não pode ser maior que o estoque disponível)
  5. Adicione um motivo (obrigatório para saídas)
  6. Toque em "Registrar"

- **Visualizar Histórico:**
  - Veja todas as movimentações registradas
  - Filtre por data ou material
  - Veja detalhes de cada movimentação

### 4. 📊 Relatórios
- **Relatório Consolidado:**
  - Visualize todas as movimentações
  - Veja totais de entradas e saídas
  - Analise tendências

- **Relatório por Material:**
  - Selecione um material específico
  - Veja histórico completo desse material

- **Exportar Dados:**
  - Gere PDF dos relatórios
  - Exporte em CSV para análise externa

### 5. ⚙️ Configurações
- Configurações do aplicativo
- Informações sobre o sistema
- Gerenciar categorias

## 📋 Fluxos de Uso Comuns

### Fluxo 1: Cadastrar um Novo Material

1. Abra o app → Aba **"Materiais"**
2. Toque em **"Adicionar Material"** ou **"+"**
3. Preencha o formulário:
   - **Nome:** Ex: "Parafuso M6x20"
   - **Descrição:** Ex: "Parafuso de aço inox"
   - **Categoria:** Selecione ou crie uma nova
   - **Quantidade Inicial:** Ex: 100
   - **Unidade:** Ex: "un" (unidade), "kg" (quilograma), "L" (litro)
4. Toque em **"Salvar"**
5. O material aparecerá na lista

### Fluxo 2: Registrar Entrada de Material

1. Abra o app → Aba **"Movimentações"**
2. Toque em **"Nova Movimentação"**
3. Selecione **"Entrada"**
4. Escolha o **Material** da lista
5. Informe a **Quantidade** que está entrando
6. Adicione um **Motivo** (opcional): Ex: "Compra", "Devolução"
7. Toque em **"Registrar"**
8. O estoque será atualizado automaticamente

### Fluxo 3: Registrar Saída de Material

1. Abra o app → Aba **"Movimentações"**
2. Toque em **"Nova Movimentação"**
3. Selecione **"Saída"**
4. Escolha o **Material** da lista
5. Informe a **Quantidade** que está saindo
   - ⚠️ A quantidade não pode ser maior que o estoque disponível
6. Adicione um **Motivo** (obrigatório): Ex: "Uso em produção", "Venda"
7. Toque em **"Registrar"**
8. O estoque será atualizado automaticamente

### Fluxo 4: Verificar Estoque

1. Abra o app → Aba **"Materiais"**
2. Visualize a lista de materiais
3. Veja a **Quantidade** disponível de cada material
4. Use a busca para encontrar materiais específicos

### Fluxo 5: Gerar Relatório

1. Abra o app → Aba **"Relatórios"**
2. Escolha o tipo de relatório:
   - **Consolidado:** Todas as movimentações
   - **Por Material:** Histórico de um material específico
   - **Por Período:** Filtrar por data
3. Aplique os filtros desejados
4. Visualize o relatório
5. (Opcional) Toque em **"Exportar PDF"** ou **"Exportar CSV"**

## 🔌 Usando a API Diretamente

Se você quiser integrar com outros sistemas ou fazer requisições diretas, a API está disponível em:

**Base URL:** `https://mtec-estoque-1-0-production.up.railway.app`

### Endpoints Disponíveis

#### 1. Health Check
```bash
GET /api/health
```
**Resposta:**
```json
{
  "ok": true,
  "timestamp": 1234567890,
  "message": "API MTec Estoque está operacional"
}
```

#### 2. Listar Categorias
```bash
GET /api/trpc/categories.list
```

#### 3. Criar Categoria
```bash
POST /api/trpc/categories.create
Content-Type: application/json

{
  "name": "Ferramentas",
  "description": "Categoria de ferramentas"
}
```

#### 4. Listar Materiais
```bash
GET /api/trpc/materials.list
```

#### 5. Criar Material
```bash
POST /api/trpc/materials.create
Content-Type: application/json

{
  "name": "Parafuso M6x20",
  "description": "Parafuso de aço inox",
  "categoryId": 1,
  "quantity": 100,
  "unit": "un"
}
```

#### 6. Listar Movimentações
```bash
GET /api/trpc/movements.list
```

#### 7. Criar Movimentação
```bash
POST /api/trpc/movements.create
Content-Type: application/json

{
  "materialId": 1,
  "type": "entrada",
  "quantity": 50,
  "reason": "Compra"
}
```

### Exemplo com cURL

```bash
# Verificar status da API
curl https://mtec-estoque-1-0-production.up.railway.app/api/health

# Listar materiais
curl https://mtec-estoque-1-0-production.up.railway.app/api/trpc/materials.list

# Criar material
curl -X POST https://mtec-estoque-1-0-production.up.railway.app/api/trpc/materials.create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Parafuso M6x20",
    "description": "Parafuso de aço inox",
    "categoryId": 1,
    "quantity": 100,
    "unit": "un"
  }'
```

## 🔐 Autenticação (Opcional)

Se você configurou OAuth Manus:

1. O app redirecionará para a tela de login
2. Faça login com suas credenciais Manus
3. Após o login, você terá acesso completo ao sistema

**Nota:** Se não configurou OAuth, o app funciona sem autenticação (modo desenvolvimento).

## 🐛 Solução de Problemas

### App não carrega no mobile
- ✅ Verifique se o servidor está rodando (`pnpm dev:server`)
- ✅ Verifique se o Metro Bundler está rodando (`pnpm dev:metro`)
- ✅ Certifique-se de que o dispositivo está na mesma rede Wi-Fi
- ✅ Verifique se a URL da API está configurada corretamente

### Erro ao registrar movimentação
- ✅ Verifique se o material existe
- ✅ Para saídas, verifique se há estoque suficiente
- ✅ Verifique se o motivo foi preenchido (obrigatório para saídas)

### Dados não aparecem
- ✅ Verifique se o banco de dados está configurado
- ✅ Execute as migrações: `pnpm db:push`
- ✅ Verifique os logs do servidor para erros

### API não responde
- ✅ Verifique se o servidor está rodando
- ✅ Verifique a URL: `https://mtec-estoque-1-0-production.up.railway.app/api/health`
- ✅ Verifique os logs no Railway

## 📱 Dicas de Uso

1. **Use categorias:** Organize seus materiais por categorias para facilitar a busca
2. **Registre motivos:** Sempre adicione motivos nas movimentações para rastreabilidade
3. **Verifique estoque:** Antes de registrar uma saída, verifique se há estoque suficiente
4. **Use relatórios:** Gere relatórios regularmente para acompanhar o estoque
5. **Exporte dados:** Use a exportação CSV para análises em planilhas

## 🎓 Próximos Passos

1. **Cadastre suas categorias** primeiro
2. **Cadastre seus materiais** com quantidades iniciais
3. **Registre movimentações** conforme o uso
4. **Monitore o estoque** regularmente
5. **Gere relatórios** para análise

---

**Precisa de ajuda?** Consulte:
- `GUIA_TESTE.md` - Para testar o aplicativo
- `GUIA_DEPLOY_RAILWAY.md` - Para fazer deploy
- Logs do servidor - Para debug

**Última atualização:** 2026-02-20
