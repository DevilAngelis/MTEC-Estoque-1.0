# 🪟 MTec Estoque - Versão Desktop Windows

Aplicativo desktop para Windows que funciona com duplo clique, sem necessidade de comandos complexos.

## 🚀 Início Rápido

### Para Usuários Finais

1. **Instale o aplicativo:**
   - Execute `MTec Estoque Setup.exe`
   - Siga o assistente de instalação
   - Um atalho será criado na área de trabalho

2. **Use o aplicativo:**
   - Duplo clique no atalho "MTec Estoque"
   - O aplicativo abrirá automaticamente

**Pronto!** Não precisa de comandos, Node.js, ou configuração complexa.

## 🔨 Para Desenvolvedores

### Instalar Dependências

```bash
pnpm install
```

### Executar em Modo Desenvolvimento

```bash
# Compilar servidor
pnpm build

# Iniciar aplicativo Electron
pnpm electron:dev
```

### Gerar Executável Windows

```bash
# Build completo (compila servidor + gera executável)
pnpm build:electron
```

O executável será gerado em: `release/MTec Estoque Setup.exe`

### Script de Inicialização Rápida (Windows)

Duplo clique em: `scripts/start-windows.bat`

Este script:
- Verifica se Node.js está instalado
- Instala dependências se necessário
- Compila o servidor se necessário
- Inicia o aplicativo

## 📁 Estrutura de Arquivos

```
├── electron/
│   ├── main.js          # Processo principal do Electron
│   └── preload.js       # Script de pré-carregamento
├── scripts/
│   └── start-windows.bat # Script de inicialização para Windows
├── electron-builder.json # Configuração do build
└── package.json         # Scripts e dependências
```

## 🎯 Funcionalidades

- ✅ Interface desktop nativa do Windows
- ✅ Inicia servidor automaticamente
- ✅ Funciona offline
- ✅ Banco de dados local
- ✅ Sem necessidade de comandos
- ✅ Instalador com atalhos
- ✅ Atualizações automáticas

## 📝 Requisitos

- Windows 10 ou superior
- ~200 MB de espaço em disco
- 2 GB de RAM recomendado

## 🔧 Troubleshooting

Consulte `GUIA_DESKTOP_WINDOWS.md` para soluções de problemas comuns.

---

**Desenvolvido para facilitar o uso sem conhecimento técnico!**
