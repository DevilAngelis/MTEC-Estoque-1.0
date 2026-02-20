@echo off
chcp 65001 >nul
title MTec Estoque - Iniciando...

echo.
echo ========================================
echo   MTec Estoque - Sistema de Estoque
echo ========================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Por favor, instale o Node.js de: https://nodejs.org
    echo Escolha a versao LTS (Long Term Support)
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
echo.

REM Verificar se pnpm está instalado
where pnpm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Instalando pnpm...
    call npm install -g pnpm
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Falha ao instalar pnpm
        pause
        exit /b 1
    )
)

echo [OK] pnpm encontrado
echo.

REM Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo [INFO] Instalando dependencias (isso pode demorar alguns minutos)...
    call pnpm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Falha ao instalar dependencias
        pause
        exit /b 1
    )
    echo [OK] Dependencias instaladas
    echo.
)

REM Compilar o servidor se necessário
if not exist "dist\index.js" (
    echo [INFO] Compilando servidor...
    call pnpm build
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Falha ao compilar servidor
        pause
        exit /b 1
    )
    echo [OK] Servidor compilado
    echo.
)

REM Verificar se o banco de dados precisa de migração
echo [INFO] Verificando banco de dados...
call pnpm db:push >nul 2>&1

echo.
echo ========================================
echo   Iniciando aplicativo...
echo ========================================
echo.
echo O aplicativo abrira automaticamente no navegador.
echo.
echo Para fechar, pressione Ctrl+C neste terminal.
echo.

REM Iniciar servidor e abrir navegador
start "" "http://localhost:3000"
call pnpm start

pause
