@echo off
chcp 65001 >nul
title Gerando ZIP Completo do MTec Estoque

echo.
echo ========================================
echo   Gerando arquivo ZIP COMPLETO
echo   (incluindo node_modules)
echo ========================================
echo.
echo ATENCAO: Este arquivo sera MUITO GRANDE!
echo Recomendado apenas para backup completo.
echo.
pause

REM Verificar se PowerShell está disponível
where powershell >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] PowerShell nao encontrado!
    pause
    exit /b 1
)

REM Criar nome do arquivo com data
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set datestamp=%datetime:~0,8%
set timestamp=%datetime:~8,6%
set zipname=MTec-Estoque-COMPLETO-%datestamp%-%timestamp%.zip

echo [INFO] Criando arquivo ZIP completo...
echo [INFO] Isso pode demorar varios minutos...
echo.

REM Criar ZIP com tudo exceto .git
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$exclude = @('.git', '*.log', 'debug-*.log'); ^
$files = Get-ChildItem -Path . -Recurse -File | Where-Object { ^
    $excluded = $false; ^
    foreach ($pattern in $exclude) { ^
        if ($_.FullName -like \"*$pattern*\") { $excluded = $true; break } ^
    }; ^
    -not $excluded ^
}; ^
Compress-Archive -Path $files.FullName -DestinationPath '%zipname%' -Force; ^
Write-Host '[OK] Arquivo ZIP completo criado!' -ForegroundColor Green"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ZIP COMPLETO gerado!
    echo ========================================
    echo.
    echo Arquivo: %zipname%
    echo Localizacao: %CD%\%zipname%
    echo.
    for %%A in ("%zipname%") do (
        set size=%%~zA
        set /a sizeMB=!size!/1048576
        echo Tamanho: !sizeMB! MB
    )
    echo.
) else (
    echo.
    echo [ERRO] Falha ao criar arquivo ZIP
    echo.
)

pause
