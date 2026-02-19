# Controle de Estoque Pro - TODO

## Fase 1: Estrutura Base e Banco de Dados
- [x] Configurar Drizzle ORM com SQLite
- [x] Criar schema de banco de dados (materiais, categorias, movimentações)
- [x] Implementar migrations
- [x] Criar hooks de persistência de dados

## Fase 2: Telas e Navegação
- [x] Criar estrutura de tab bar com 5 abas
- [x] Implementar tela Home/Dashboard
- [x] Implementar tela Materiais (lista)
- [x] Implementar tela Movimentações
- [x] Implementar tela Relatórios
- [x] Implementar tela Configurações

## Fase 3: Funcionalidades de Cadastro
- [x] Tela de cadastro de materiais
- [x] Tela de edição de materiais
- [ ] Tela de cadastro de categorias
- [x] Validação de campos obrigatórios
- [x] Busca e filtro de materiais

## Fase 4: Funcionalidades de Movimentação
- [x] Tela de entrada de material
- [x] Tela de saída de material
- [x] Validação de quantidade disponível
- [x] Registro de histórico de movimentações
- [x] Alertas de estoque baixo

## Fase 5: Relatórios e Impressão
- [x] Tela de relatórios com filtros
- [x] Filtro por data (inicial/final)
- [ ] Filtro por categoria
- [x] Filtro por tipo (entrada/saída/consolidado)
- [ ] Integração com sistema de impressão
- [ ] Exportação de dados

## Fase 6: Estilo e Design
- [x] Aplicar paleta de cores Windows-inspired
- [x] Estilizar componentes (botões, inputs, cards)
- [x] Implementar feedback visual (toasts, alertas)
- [x] Ajustar responsividade para diferentes telas
- [ ] Testes de acessibilidade

## Fase 7: Branding e Assets
- [x] Gerar logo do aplicativo
- [x] Atualizar app.config.ts com nome e logo
- [x] Configurar ícones para tab bar
- [ ] Configurar splash screen

## Fase 8: Testes e Otimização
- [ ] Testes unitários de funcionalidades críticas
- [ ] Testes de persistência de dados
- [ ] Otimização de performance
- [ ] Testes em dispositivo real

## Fase 9: Geração de APK
- [ ] Configurar build para Android
- [ ] Gerar APK assinado
- [ ] Testar APK em dispositivo
- [ ] Documentar instruções de instalação

## Fase 10: Entrega
- [ ] Criar checkpoint final
- [ ] Preparar documentação de uso
- [ ] Entregar APK ao usuário
- [ ] Instruções de instalação e uso


## Melhorias Solicitadas
- [x] Adicionar filtro de material específico nos relatórios
- [x] Reformular cadastro de material com labels mais intuitivos
- [x] Adicionar seção de produtos com saldo disponível na tela inicial
- [x] Adicionar ação rápida de cadastro de material


## Novas Melhorias Solicitadas
- [x] Bloquear exclusão de material com movimentações
- [x] Adicionar opção de excluir movimentação
- [x] Atualizar estoque ao deletar movimentação
- [x] Personalizar com cores MTec Energia (verde neon)
- [x] Atualizar logo com identidade MTec


## Funcionalidades Avançadas
- [x] Sincronização em nuvem (backup automático)
- [x] Geração de relatórios em PDF
- [x] Interface web para acesso via navegador
- [x] Autenticação de usuário
- [x] Exportação de dados (CSV/Excel)


## Bugs Reportados
- [x] Opção de excluir movimentação não está funcionando (CORRIGIDO)
