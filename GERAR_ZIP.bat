@echo off
chcp 65001 >nul
title Gerando ZIP do MTec Estoque

echo.
echo ========================================
echo   Gerando arquivo ZIP do projeto
echo ========================================
echo.

REM Verificar se PowerShell está disponível
where powershell >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] PowerShell nao encontrado!
    echo Por favor, use o Windows 10 ou superior.
    pause
    exit /b 1
)

REM Criar nome do arquivo com data
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set datestamp=%datetime:~0,8%
set timestamp=%datetime:~8,6%
set zipname=MTec-Estoque-%datestamp%-%timestamp%.zip

echo [INFO] Criando arquivo ZIP: %zipname%
echo.

REM Usar script PowerShell
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0gerar-zip.ps1"
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ZIP gerado com sucesso!
    echo ========================================
    echo.
    echo Arquivo criado na pasta atual.
    echo.
) else (
    echo.
    echo [ERRO] Falha ao criar arquivo ZIP
    echo Tente executar gerar-zip.ps1 diretamente.
    echo.
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ZIP gerado com sucesso!
    echo ========================================
    echo.
    echo Arquivo: %zipname%
    echo Localizacao: %CD%\%zipname%
    echo.
    echo Tamanho aproximado: 
    for %%A in ("%zipname%") do echo   %%~zA bytes
    echo.
) else (
    echo.
    echo [ERRO] Falha ao criar arquivo ZIP
    echo.
)

pause
