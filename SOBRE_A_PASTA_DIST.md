# Sobre a pasta DIST (instalador e EXE)

A pasta **dist** não fica salva no projeto: ela é **gerada** quando você roda o build do Electron.

## Como recriar a pasta dist (EXE + instalador)

Na pasta do projeto, execute:

```batch
GERAR_INSTALADOR.bat
```

Ou manualmente:

```batch
npm install
npm run build
```

## O que aparece dentro de dist

Depois do build você terá algo como:

- **dist\win-unpacked\** – pasta com o app descompactado  
  - **MTec Estoque.exe** – executável para rodar sem instalar
- **dist\MTec Estoque Setup x.x.x.exe** – instalador (NSIS)
- **dist\MTec Estoque x.x.x.exe** – versão portable (um único EXE)

## Se a pasta dist sumir de novo

- Não commitamos a pasta **dist** no Git (ela é resultado de build).
- Sempre que precisar do instalador ou do EXE, rode de novo:  
  **GERAR_INSTALADOR.bat** ou **npm run build**.

## Requisitos para o build

- Node.js instalado
- Na pasta do projeto: **main.js**, **preload.js**, **MTec_Estoque_Supabase.html**
- Comando: `npm run build` (usa electron-builder)
