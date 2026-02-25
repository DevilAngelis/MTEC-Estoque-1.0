@echo off
chcp 65001 >nul
echo ========================================
echo   MTec Estoque - Gerar instalador / EXE
echo ========================================
echo.

if not exist "main.js" (
  echo ERRO: main.js nao encontrado. Execute na pasta do projeto.
  pause
  exit /b 1
)

if not exist "MTec_Estoque_Supabase.html" (
  echo ERRO: MTec_Estoque_Supabase.html nao encontrado na pasta do projeto.
  pause
  exit /b 1
)

echo [1/2] Instalando dependencias (se necessario)...
call npm install
if errorlevel 1 ( echo Falha no npm install. & pause & exit /b 1 )

echo.
echo [2/2] Gerando instalador e EXE (electron-builder)...
call npm run build
if errorlevel 1 (
  echo Falha no build. Verifique se main.js, preload.js e MTec_Estoque_Supabase.html existem.
  pause
  exit /b 1
)

echo.
echo Concluido. Saida em: dist\
echo.
if exist "dist\win-unpacked\MTec Estoque.exe" (
  echo EXE: dist\win-unpacked\MTec Estoque.exe
)
if exist "dist\MTec Estoque Setup *.exe" (
  echo Instalador: dist\MTec Estoque Setup *.exe
) else (
  for %%F in ("dist\*.exe") do echo Instalador: %%F
)
if exist "dist\MTec Estoque *.exe" (
  for %%F in ("dist\MTec Estoque *.exe") do echo Portable: %%F
)
echo.
start "" "dist"
pause
