# 🪟 Guia de Instalação e Uso - Versão Desktop Windows

Este guia explica como instalar e usar o aplicativo MTec Estoque na versão desktop para Windows, sem necessidade de comandos complexos.

## 📦 Instalação

### Opção 1: Executável Instalador (.exe) - RECOMENDADO

1. **Baixe o instalador:**
   - Arquivo: `MTec Estoque Setup.exe`
   - Localização: Pasta `release` após o build

2. **Execute o instalador:**
   - Duplo clique no arquivo `.exe`
   - Siga o assistente de instalação
   - Escolha o diretório de instalação (opcional)
   - O aplicativo será instalado e um atalho será criado na área de trabalho

3. **Inicie o aplicativo:**
   - Duplo clique no atalho "MTec Estoque" na área de trabalho
   - OU procure por "MTec Estoque" no menu Iniciar

### Opção 2: Executável Portátil

1. **Baixe o executável portátil:**
   - Arquivo: `MTec Estoque.exe`
   - Localização: Pasta `release/win-unpacked`

2. **Execute diretamente:**
   - Duplo clique no arquivo `.exe`
   - Não requer instalação

## 🚀 Como Usar

### Iniciar o Aplicativo

**Método 1: Atalho na Área de Trabalho**
- Duplo clique no ícone "MTec Estoque"

**Método 2: Menu Iniciar**
- Clique em "Iniciar"
- Digite "MTec Estoque"
- Clique no aplicativo

**Método 3: Desenvolvimento**
- Execute `pnpm build && pnpm electron:dev` no terminal (para desenvolvedores)

### Interface do Aplicativo

O aplicativo abrirá em uma janela do Windows com:

- **Barra de Menu:** Arquivo, Visualizar, Ajuda
- **Interface Completa:** Todas as funcionalidades do sistema
- **Navegação por Abas:** Home, Materiais, Movimentações, Relatórios, Configurações

### Funcionalidades

#### 1. 🏠 Home (Dashboard)
- Visão geral do estoque
- Estatísticas e métricas
- Acesso rápido às funcionalidades

#### 2. 📦 Materiais
- **Adicionar Material:**
  1. Clique em "Adicionar Material" ou no botão "+"
  2. Preencha os campos: Nome, Descrição, Categoria, Quantidade, Unidade
  3. Clique em "Salvar"

- **Editar Material:**
  1. Clique no material na lista
  2. Altere os dados necessários
  3. Clique em "Salvar"

- **Deletar Material:**
  1. Clique no material
  2. Clique em "Deletar"
  3. Confirme a ação

#### 3. 🔄 Movimentações
- **Registrar Entrada:**
  1. Clique em "Nova Movimentação"
  2. Selecione "Entrada"
  3. Escolha o material
  4. Informe a quantidade
  5. Adicione motivo (opcional)
  6. Clique em "Registrar"

- **Registrar Saída:**
  1. Clique em "Nova Movimentação"
  2. Selecione "Saída"
  3. Escolha o material
  4. Informe a quantidade (não pode exceder o estoque)
  5. Adicione motivo (obrigatório)
  6. Clique em "Registrar"

#### 4. 📊 Relatórios
- Visualizar relatórios consolidados
- Filtrar por data ou material
- Exportar em PDF ou CSV

#### 5. ⚙️ Configurações
- Gerenciar categorias
- Configurações do sistema

## 🔧 Requisitos do Sistema

- **Sistema Operacional:** Windows 10 ou superior
- **Espaço em Disco:** ~200 MB
- **RAM:** Mínimo 2 GB recomendado
- **Conexão:** Não requer internet (funciona offline)

## 🐛 Solução de Problemas

### O aplicativo não inicia

1. **Verifique se o Node.js está instalado:**
   - Baixe de: https://nodejs.org
   - Instale a versão LTS

2. **Verifique os logs:**
   - O aplicativo cria logs em: `%APPDATA%\MTec Estoque\logs`

3. **Reinstale o aplicativo:**
   - Desinstale via "Adicionar ou Remover Programas"
   - Reinstale usando o instalador

### Erro ao registrar movimentação

- ✅ Verifique se o material existe
- ✅ Para saídas, verifique se há estoque suficiente
- ✅ Preencha o motivo (obrigatório para saídas)

### Dados não aparecem

- ✅ Verifique se o banco de dados está configurado
- ✅ O banco de dados local está em: `%APPDATA%\MTec Estoque\database`

### Janela não abre

- ✅ Verifique se outra instância já está rodando
- ✅ Feche todas as instâncias e tente novamente
- ✅ Reinicie o computador se necessário

## 📝 Primeira Configuração

Na primeira execução:

1. **Configure o Banco de Dados:**
   - O aplicativo criará automaticamente o banco de dados local
   - Não é necessário configuração adicional

2. **Crie Categorias:**
   - Vá em Configurações → Categorias
   - Adicione suas categorias de materiais

3. **Cadastre Materiais:**
   - Vá em Materiais → Adicionar Material
   - Preencha os dados dos seus materiais

## 💾 Backup de Dados

O banco de dados está localizado em:
```
%APPDATA%\MTec Estoque\database
```

**Para fazer backup:**
1. Feche o aplicativo
2. Copie a pasta `database` para um local seguro
3. Para restaurar, substitua a pasta `database`

## 🔄 Atualizações

Quando uma nova versão estiver disponível:

1. Baixe o novo instalador
2. Execute o instalador
3. Ele atualizará automaticamente mantendo seus dados

## 🗑️ Desinstalação

1. Vá em "Configurações" → "Aplicativos"
2. Procure por "MTec Estoque"
3. Clique em "Desinstalar"
4. Confirme a desinstalação

**Nota:** Seus dados serão mantidos em `%APPDATA%\MTec Estoque\database` mesmo após desinstalar.

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs em: `%APPDATA%\MTec Estoque\logs`
2. Consulte o arquivo `GUIA_USO.md` para mais detalhes
3. Verifique se todos os requisitos estão atendidos

---

**Versão:** 1.0.0  
**Última atualização:** 2026-02-20
