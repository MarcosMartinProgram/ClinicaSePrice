# Script de deployment para SePrice (PowerShell)
Write-Host "🚀 Iniciando proceso de deployment para SePrice..." -ForegroundColor Green

# Verificar que estamos en la rama correcta
$branch = git branch --show-current
Write-Host "📍 Rama actual: $branch" -ForegroundColor Cyan

# Ejecutar linting
Write-Host "🔍 Ejecutando linting..." -ForegroundColor Yellow
npm run lint

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en el linting. Corrige los errores antes de continuar." -ForegroundColor Red
    exit 1
}

# Build del proyecto
Write-Host "🔨 Construyendo el proyecto..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en el build. Verifica la configuración." -ForegroundColor Red
    exit 1
}

# Agregar cambios a Git
Write-Host "📝 Agregando cambios a Git..." -ForegroundColor Yellow
git add .

# Solicitar mensaje de commit
$commitMessage = Read-Host "💬 Ingresa el mensaje del commit"

if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "feat: actualización del sistema SePrice"
}

# Commit
git commit -m "$commitMessage"

# Push a la rama actual
Write-Host "⬆️ Subiendo cambios a GitHub..." -ForegroundColor Yellow
git push origin $branch

Write-Host "✅ Deployment completado!" -ForegroundColor Green
Write-Host "🌐 El proyecto se desplegará automáticamente en Vercel" -ForegroundColor Cyan
Write-Host "📱 Verifica el estado en: https://vercel.com/dashboard" -ForegroundColor Cyan