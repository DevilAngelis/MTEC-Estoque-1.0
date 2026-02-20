@echo off
echo ========================================
echo   MTec Estoque - Iniciando Aplicativo
echo ========================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js de https://nodejs.org
    pause
    exit /b 1
)

REM Verificar se pnpm está instalado
where pnpm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Instalando pnpm...
    npm install -g pnpm
)

REM Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo Instalando dependencias...
    call pnpm install
)

REM Compilar o servidor se necessário
if not exist "dist\index.js" (
    echo Compilando servidor...
    call pnpm build
)

REM Iniciar aplicativo Electron
echo Iniciando aplicativo...
call pnpm electron:start

pause
