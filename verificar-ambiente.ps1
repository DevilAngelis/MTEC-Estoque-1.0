# Verifica se JAVA_HOME e ANDROID_HOME estao configurados (para gerar APK)
# Execute: powershell -ExecutionPolicy Bypass -File verificar-ambiente.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Verificacao: Java e Android SDK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ok = $true

# JAVA_HOME
$jhome = $env:JAVA_HOME
if ([string]::IsNullOrEmpty($jhome)) {
    Write-Host "[X] JAVA_HOME nao esta definido." -ForegroundColor Red
    Write-Host "    Defina em: Painel de Controle > Sistema > Configuracoes avancadas > Variaveis de ambiente" -ForegroundColor Yellow
    Write-Host "    Valor exemplo: C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot" -ForegroundColor Gray
    $ok = $false
} else {
    Write-Host "[OK] JAVA_HOME = $jhome" -ForegroundColor Green
    if (Test-Path "$jhome\bin\java.exe") {
        $v = & "$jhome\bin\java.exe" -version 2>&1
        Write-Host "     $v" -ForegroundColor Gray
    } else {
        Write-Host "     AVISO: java.exe nao encontrado em $jhome\bin" -ForegroundColor Yellow
        $ok = $false
    }
}

Write-Host ""

# ANDROID_HOME
$ahome = $env:ANDROID_HOME
if ([string]::IsNullOrEmpty($ahome)) {
    Write-Host "[X] ANDROID_HOME nao esta definido." -ForegroundColor Red
    Write-Host "    Instale o Android Studio e defina ANDROID_HOME com o caminho do SDK." -ForegroundColor Yellow
    Write-Host "    Valor exemplo: C:\Users\$env:USERNAME\AppData\Local\Android\Sdk" -ForegroundColor Gray
    $ok = $false
} else {
    Write-Host "[OK] ANDROID_HOME = $ahome" -ForegroundColor Green
    if (Test-Path "$ahome\platform-tools\adb.exe") {
        Write-Host "     SDK encontrado (platform-tools OK)." -ForegroundColor Gray
    } else {
        Write-Host "     AVISO: platform-tools nao encontrado. Instale o Android SDK pelo Android Studio." -ForegroundColor Yellow
        $ok = $false
    }
}

Write-Host ""

if ($ok) {
    Write-Host "Ambiente OK. Voce pode rodar GERAR_APK.bat ou npm run apk" -ForegroundColor Green
} else {
    Write-Host "Corrija os itens acima e consulte CONFIGURAR_JAVA_E_ANDROID.md" -ForegroundColor Yellow
}

Write-Host ""
