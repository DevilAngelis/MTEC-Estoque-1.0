# Script para gerar ZIP do projeto MTec Estoque

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Gerando arquivo ZIP do projeto" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Criar nome do arquivo com data
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipname = "MTec-Estoque-$timestamp.zip"

Write-Host "[INFO] Criando arquivo ZIP: $zipname" -ForegroundColor Yellow
Write-Host ""

# Pastas e arquivos para excluir
$excludePatterns = @(
    "node_modules",
    "dist",
    "release",
    ".expo",
    ".git",
    "*.log",
    ".manus-logs",
    ".webdev",
    "debug-*.log",
    ".cursor"
)

# Obter todos os arquivos, excluindo os padrões
$files = Get-ChildItem -Path . -Recurse -File | Where-Object {
    $filePath = $_.FullName
    $shouldExclude = $false
    
    foreach ($pattern in $excludePatterns) {
        if ($filePath -like "*$pattern*") {
            $shouldExclude = $true
            break
        }
    }
    
    -not $shouldExclude
}

# Criar o ZIP
try {
    Compress-Archive -Path $files.FullName -DestinationPath $zipname -Force
    
    $zipFile = Get-Item $zipname
    $sizeMB = [math]::Round($zipFile.Length / 1MB, 2)
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ZIP gerado com sucesso!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Arquivo: $zipname" -ForegroundColor White
    Write-Host "Localizacao: $($zipFile.FullName)" -ForegroundColor White
    Write-Host "Tamanho: $sizeMB MB" -ForegroundColor White
    Write-Host ""
    Write-Host "Arquivo pronto para salvar/backup!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "[ERRO] Falha ao criar arquivo ZIP: $_" -ForegroundColor Red
    Write-Host ""
}

Read-Host "Pressione Enter para fechar"
