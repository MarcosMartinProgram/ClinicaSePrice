# Script para inicializar Git y subir a GitHub
Write-Host "🔧 Configurando Git para SePrice..." -ForegroundColor Green

# Verificar si ya existe .git
if (Test-Path ".git") {
    Write-Host "⚠️ Git ya está inicializado en este directorio" -ForegroundColor Yellow
} else {
    # Inicializar Git
    Write-Host "📦 Inicializando repositorio Git..." -ForegroundColor Cyan
    git init
}

# Configurar nombre y email si no están configurados
$gitUser = git config user.name
$gitEmail = git config user.email

if ([string]::IsNullOrWhiteSpace($gitUser)) {
    $userName = Read-Host "Ingresa tu nombre para Git"
    git config user.name "$userName"
}

if ([string]::IsNullOrWhiteSpace($gitEmail)) {
    $userEmail = Read-Host "Ingresa tu email para Git"
    git config user.email "$userEmail"
}

# Agregar archivos
Write-Host "📁 Agregando archivos al repositorio..." -ForegroundColor Cyan
git add .

# Primer commit
Write-Host "💾 Creando commit inicial..." -ForegroundColor Cyan
git commit -m "feat: sistema completo SePrice v1.0.0

✨ Características implementadas:
- Sistema de autenticación con roles
- Gestión completa de pacientes
- Gestión de profesionales y especialidades
- Sistema avanzado de turnos
- Módulo de atenciones médicas
- Gestión de consultorios
- Sala de espera en tiempo real
- Sistema de reportes
- Configuración del sistema

🚀 Tecnologías:
- React 18 + Vite
- Tailwind CSS
- React Router
- Context API
- LocalStorage

🔐 Credenciales de prueba:
- Recepcionista: recepcion/123456
- Médico: doctor/123456
- Administrador: admin/123456"

# Solicitar URL del repositorio remoto
Write-Host ""
Write-Host "🌐 Para conectar con GitHub:" -ForegroundColor Yellow
Write-Host "1. Crea un nuevo repositorio en https://github.com" -ForegroundColor White
Write-Host "2. Copia la URL del repositorio (ej: https://github.com/usuario/seprice-clinic.git)" -ForegroundColor White
Write-Host ""

$repoUrl = Read-Host "🔗 Pega la URL del repositorio de GitHub (opcional, presiona Enter para omitir)"

if (![string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "🔗 Configurando remote origin..." -ForegroundColor Cyan
    git remote add origin $repoUrl
    
    Write-Host "📤 Configurando rama main..." -ForegroundColor Cyan
    git branch -M main
    
    Write-Host "⬆️ Subiendo código a GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    Write-Host ""
    Write-Host "✅ ¡Código subido exitosamente a GitHub!" -ForegroundColor Green
    Write-Host "🌐 Ahora puedes conectar tu repositorio con Vercel para el deploy automático" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "✅ Git configurado localmente" -ForegroundColor Green
    Write-Host "📝 Para subir a GitHub más tarde, ejecuta:" -ForegroundColor Cyan
    Write-Host "   git remote add origin <URL_DEL_REPO>" -ForegroundColor White
    Write-Host "   git branch -M main" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "🎉 ¡Configuración completada!" -ForegroundColor Green