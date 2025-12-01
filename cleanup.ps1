# Script para limpar memória e cache do projeto

Write-Host "=== Limpeza de Memória e Cache ===" -ForegroundColor Cyan

# Parar containers Docker
Write-Host "1. Parando Docker containers..." -ForegroundColor Yellow
docker-compose down 2>$null
docker system prune -f 2>$null
Write-Host "   ✓ Docker limpo" -ForegroundColor Green

# Parar processos Node
Write-Host "2. Encerrando processos Node..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "   ✓ Processos Node encerrados" -ForegroundColor Green

# Limpar cache do VS Code
Write-Host "3. Limpando cache do VS Code..." -ForegroundColor Yellow
Remove-Item -Path "$env:APPDATA\Code\Cache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Code\Code Cache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Code\CachedExtensionVSIXs" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   ✓ Cache do VS Code limpo" -ForegroundColor Green

# Limpar cache de dependências
Write-Host "4. Limpando cache de dependências..." -ForegroundColor Yellow
yarn cache clean 2>$null
npm cache clean --force 2>$null
Write-Host "   ✓ Cache de dependências limpo" -ForegroundColor Green

# Limpar node_modules se muito grande
$nodeModulesPath = ".\node_modules"
if (Test-Path $nodeModulesPath) {
    $size = (Get-ChildItem $nodeModulesPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1GB
    if ($size -gt 2) {
        Write-Host "5. node_modules muito grande ($([math]::Round($size,2)) GB), removendo..." -ForegroundColor Yellow
        Remove-Item $nodeModulesPath -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "   ✓ node_modules removido" -ForegroundColor Green
    }
}

# Shutdown WSL
Write-Host "6. Desligando WSL..." -ForegroundColor Yellow
wsl --shutdown 2>$null
Write-Host "   ✓ WSL desligado" -ForegroundColor Green

Write-Host "`n=== Limpeza Concluída ===" -ForegroundColor Cyan
Write-Host "Memória liberada. Você pode reabrir o VS Code agora." -ForegroundColor Green
