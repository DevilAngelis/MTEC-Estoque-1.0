# 🔨 Como Gerar o Executável Windows (.exe)

Este guia explica como gerar o executável `.exe` do aplicativo MTec Estoque para Windows.

## 📋 Pré-requisitos

1. **Node.js instalado** (versão 18 ou superior)
   - Baixe em: https://nodejs.org

2. **pnpm instalado**
   ```bash
   npm install -g pnpm
   ```

## 🚀 Passo a Passo

### 1. Instalar Dependências

```bash
pnpm install
```

Isso instalará todas as dependências, incluindo Electron e electron-builder.

### 2. Compilar o Servidor

```bash
pnpm build
```

Isso compila o código do servidor para a pasta `dist/`.

### 3. Gerar o Executável

```bash
pnpm build:electron
```

Este comando:
- Compila o servidor (se necessário)
- Empacota tudo com Electron
- Gera o instalador `.exe` na pasta `release/`

## 📦 Resultado

Após o build, você encontrará:

```
release/
├── MTec Estoque Setup.exe    ← Instalador (use este!)
└── win-unpacked/
    └── MTec Estoque.exe      ← Executável portátil
```

## 🎯 Distribuição

### Para Usuários Finais

Distribua apenas o arquivo: **`MTec Estoque Setup.exe`**

O usuário só precisa:
1. Executar o `.exe`
2. Seguir o assistente de instalação
3. Usar o aplicativo pelo atalho criado

**Não precisa de Node.js, comandos, ou conhecimento técnico!**

## 🔧 Troubleshooting

### Erro: "electron-builder não encontrado"

```bash
pnpm install
```

### Erro: "Cannot find module"

Certifique-se de que todas as dependências estão instaladas:
```bash
pnpm install
```

### Build muito lento

Isso é normal na primeira vez. O Electron baixa os binários necessários.

### Erro de permissão no Windows

Execute o PowerShell/CMD como Administrador.

## 📝 Notas

- O primeiro build pode demorar alguns minutos (baixa dependências)
- Builds subsequentes são mais rápidos
- O executável gerado funciona em qualquer Windows 10+ sem instalação adicional
- Tamanho aproximado: ~150-200 MB

---

**Pronto!** Agora você tem um executável Windows que funciona com duplo clique! 🎉
