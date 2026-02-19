# Design - Controle de Estoque Pro

## Visão Geral
Aplicativo de controle de estoque para Android com interface estilo Windows, focado em funcionalidade, clareza e persistência de dados. O app permite gerenciar materiais, categorias, entrada/saída de itens, e gerar relatórios com filtros e opções de impressão.

---

## Orientação & Uso
- **Orientação**: Portrait (9:16)
- **Uso**: Uma mão (botões acessíveis na metade inferior da tela)
- **Estilo**: Windows-inspired (limpo, funcional, sem excesso de decoração)
- **Cores**: Paleta profissional com tons neutros e acentos funcionais

---

## Paleta de Cores
| Elemento | Cor | Uso |
|----------|-----|-----|
| Primário | `#0066CC` | Botões principais, destaques |
| Secundário | `#6C757D` | Textos secundários, ícones inativos |
| Sucesso | `#28A745` | Entrada de material, ações positivas |
| Aviso | `#FFC107` | Alertas, estoque baixo |
| Erro | `#DC3545` | Saída, exclusão, erros |
| Fundo | `#F8F9FA` | Background principal |
| Superfície | `#FFFFFF` | Cards, inputs, modais |
| Borda | `#DEE2E6` | Divisores, bordas |
| Texto | `#212529` | Texto principal |
| Texto Muted | `#6C757D` | Texto secundário |

---

## Lista de Telas

### 1. **Home / Dashboard**
Tela inicial com resumo do estoque e acesso rápido às funcionalidades principais.

**Conteúdo:**
- Resumo de estatísticas (total de itens, categorias, últimas movimentações)
- Botões de ação rápida: Entrada, Saída, Novo Material, Relatórios
- Lista de movimentações recentes (últimas 5-10)
- Indicador visual de estoque baixo

**Funcionalidade:**
- Exibir dados em cards com ícones
- Navegação para outras telas via botões
- Atualização em tempo real

---

### 2. **Cadastro de Materiais**
Tela para adicionar e editar materiais no estoque.

**Conteúdo:**
- Campos de entrada: Nome, Descrição, Categoria, Quantidade, Unidade, Preço Unitário
- Seletor de categoria (dropdown)
- Botões: Salvar, Cancelar

**Funcionalidade:**
- Validação de campos obrigatórios
- Persistência em banco de dados local (SQLite)
- Edição de materiais existentes
- Exclusão com confirmação

---

### 3. **Lista de Materiais**
Tela que exibe todos os materiais cadastrados.

**Conteúdo:**
- Lista com cards/linhas mostrando: Nome, Categoria, Quantidade, Unidade
- Ícone de status (estoque baixo, normal, alto)
- Barra de busca/filtro
- Botão flutuante para adicionar novo material

**Funcionalidade:**
- Buscar por nome
- Filtrar por categoria
- Ordenar por quantidade, nome, etc.
- Tap para editar/visualizar detalhes
- Swipe para deletar (com confirmação)

---

### 4. **Entrada de Material**
Tela para registrar entrada de materiais no estoque.

**Conteúdo:**
- Seletor de material (dropdown/busca)
- Campo de quantidade
- Campo de data (padrão: hoje)
- Campo de observações (opcional)
- Botões: Registrar, Cancelar

**Funcionalidade:**
- Incrementar quantidade do material automaticamente
- Registrar data/hora da movimentação
- Salvar em histórico de movimentações
- Feedback visual de sucesso

---

### 5. **Saída de Material**
Tela para registrar saída de materiais do estoque.

**Conteúdo:**
- Seletor de material (dropdown/busca)
- Campo de quantidade
- Campo de motivo (dropdown: Venda, Devolução, Descarte, Outro)
- Campo de data (padrão: hoje)
- Campo de observações (opcional)
- Botões: Registrar, Cancelar

**Funcionalidade:**
- Validar se há quantidade suficiente
- Decrementar quantidade do material
- Registrar motivo da saída
- Alertar se quantidade ficar baixa
- Salvar em histórico

---

### 6. **Cadastro de Categorias**
Tela para gerenciar categorias de materiais.

**Conteúdo:**
- Lista de categorias existentes
- Campo de entrada para nova categoria
- Botão: Adicionar
- Ícone de deletar para cada categoria

**Funcionalidade:**
- Adicionar categoria
- Deletar categoria (com confirmação)
- Validar nome único
- Persistir em banco de dados

---

### 7. **Gerenciador de Estoque**
Tela de visualização consolidada do estoque atual.

**Conteúdo:**
- Tabela/lista com: Material, Categoria, Quantidade, Unidade, Preço Total, Status
- Filtros: Por categoria, por status (baixo/normal/alto)
- Ordenação: Por quantidade, nome, categoria
- Indicadores visuais de status

**Funcionalidade:**
- Visualizar estoque completo
- Filtrar e ordenar dados
- Exportar para relatório
- Atualizar quantidades manualmente (edição rápida)

---

### 8. **Relatórios**
Tela para gerar e visualizar relatórios de entrada/saída.

**Conteúdo:**
- Seletor de tipo: Entrada, Saída, Consolidado
- Filtros: Data inicial, Data final, Categoria, Material
- Botões: Filtrar, Limpar, Imprimir, Exportar
- Tabela com resultados: Data, Material, Categoria, Quantidade, Motivo, Observações

**Funcionalidade:**
- Filtrar por período
- Filtrar por categoria/material
- Gerar relatório consolidado
- Opção de impressão (via sistema)
- Visualizar totalizações (quantidade total, valor total)

---

### 9. **Configurações**
Tela para ajustes do aplicativo.

**Conteúdo:**
- Opções: Tema (claro/escuro), Unidades padrão, Limite de estoque baixo
- Informações do app: Versão, Desenvolvedor
- Botão: Limpar dados (com confirmação)

**Funcionalidade:**
- Alternar tema
- Definir unidade padrão (kg, L, un, etc.)
- Definir limite para alertas de estoque baixo
- Backup/Restauração de dados (futuro)

---

## Fluxos de Usuário Principais

### Fluxo 1: Cadastrar Novo Material
1. Home → Botão "Novo Material"
2. Tela de Cadastro → Preencher campos
3. Selecionar categoria
4. Salvar → Confirmação visual
5. Retornar à Home

### Fluxo 2: Registrar Entrada
1. Home → Botão "Entrada"
2. Tela de Entrada → Selecionar material
3. Inserir quantidade
4. Registrar → Confirmação
5. Retornar à Home

### Fluxo 3: Registrar Saída
1. Home → Botão "Saída"
2. Tela de Saída → Selecionar material
3. Inserir quantidade
4. Selecionar motivo
5. Registrar → Confirmação
6. Retornar à Home

### Fluxo 4: Gerar Relatório
1. Home → Botão "Relatórios"
2. Tela de Relatórios → Selecionar tipo
3. Aplicar filtros (data, categoria, etc.)
4. Visualizar resultados
5. Imprimir ou Exportar
6. Retornar à Home

### Fluxo 5: Gerenciar Categorias
1. Home → Menu → Categorias
2. Tela de Categorias → Adicionar/Deletar
3. Confirmação
4. Retornar à Home

---

## Navegação (Tab Bar)
- **Home** (ícone: casa)
- **Materiais** (ícone: lista)
- **Movimentações** (ícone: setas)
- **Relatórios** (ícone: gráfico)
- **Configurações** (ícone: engrenagem)

---

## Padrões de Interação

### Botões
- **Primários**: Azul (#0066CC), padding 12px, border-radius 6px
- **Secundários**: Cinza (#6C757D), padding 12px
- **Perigosos**: Vermelho (#DC3545) para deletar/sair

### Inputs
- Border: 1px sólida (#DEE2E6)
- Padding: 12px
- Border-radius: 4px
- Foco: Border azul (#0066CC)

### Cards
- Background: Branco (#FFFFFF)
- Border: 1px (#DEE2E6)
- Padding: 16px
- Border-radius: 8px
- Sombra leve

### Modais/Diálogos
- Overlay escuro semi-transparente
- Card centralizado com padding
- Botões: Cancelar (secundário), Confirmar (primário)

### Feedback
- Toast/Snackbar para confirmações
- Alertas para erros e validações
- Loading spinner durante operações

---

## Persistência de Dados
- **Banco de Dados**: SQLite local (via Drizzle ORM)
- **Dados Persistidos**:
  - Materiais (nome, descrição, categoria, quantidade, unidade, preço)
  - Categorias
  - Histórico de movimentações (entrada/saída com data, hora, quantidade, motivo)
  - Configurações do usuário

---

## Considerações de Design
- Interface limpa e sem excesso de decoração (estilo Windows)
- Acessibilidade: Textos legíveis, contraste adequado
- Responsividade: Adaptado para diferentes tamanhos de tela
- Feedback visual claro para todas as ações
- Sem necessidade de autenticação (dados locais)
