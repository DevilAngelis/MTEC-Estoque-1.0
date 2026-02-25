@echo off
chcp 65001 >nul
echo ========================================
echo   MTec Estoque - Gerar APK (Android)
echo ========================================
echo.

if not exist "MTec_Estoque_Supabase.html" (
  echo ERRO: Arquivo MTec_Estoque_Supabase.html nao encontrado na pasta do projeto.
  echo Coloque o HTML do app na raiz e execute novamente.
  pause
  exit /b 1
)

echo [1/5] Instalando dependencias...
call npm install
if errorlevel 1 ( echo Falha no npm install. & pause & exit /b 1 )

echo.
echo [2/5] Preparando pasta www...
call npm run build:web
if errorlevel 1 ( echo Falha ao copiar HTML para www. & pause & exit /b 1 )

if not exist "android" (
  echo.
  echo [2b] Adicionando plataforma Android (primeira vez)...
  call npx cap add android
  if errorlevel 1 ( echo Falha ao adicionar Android. Instale Java JDK 17 e Android SDK. & pause & exit /b 1 )
)

echo.
echo [3/5] Sincronizando web com Android...
call npx cap sync android
if errorlevel 1 ( echo Falha no cap sync. & pause & exit /b 1 )

echo.
echo [4/5] Gerando APK (debug)...
cd android
if exist gradlew.bat (
  call gradlew.bat assembleDebug
) else (
  call gradlew assembleDebug
)
if errorlevel 1 (
  cd ..
  echo Falha no build. Verifique JAVA_HOME e ANDROID_HOME.
  pause
  exit /b 1
)
cd ..

echo.
echo [5/5] Concluido.
echo.
echo APK gerado em:
echo   android\app\build\outputs\apk\debug\app-debug.apk
echo.
explorer "android\app\build\outputs\apk\debug" 2>nul
pause
