@echo off
chcp 65001 >nul
title MTec Estoque - Modo Desenvolvimento

echo.
echo ========================================
echo   MTec Estoque - Modo Desenvolvimento
echo ========================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale o Node.js de: https://nodejs.org
    pause
    exit /b 1
)

REM Verificar se pnpm está instalado
where pnpm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Instalando pnpm...
    call npm install -g pnpm
)

REM Verificar dependências
if not exist "node_modules" (
    echo [INFO] Instalando dependencias...
    call pnpm install
)

echo.
echo ========================================
echo   Iniciando servidor e interface...
echo ========================================
echo.
echo O aplicativo abrira automaticamente no navegador.
echo Para fechar, pressione Ctrl+C.
echo.

REM Abrir navegador após alguns segundos
timeout /t 3 /nobreak >nul
start "" "http://localhost:8081"

REM Iniciar em modo desenvolvimento
call pnpm dev

pause
