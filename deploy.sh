#!/bin/bash

# Script de deployment para SePrice
echo "🚀 Iniciando proceso de deployment para SePrice..."

# Verificar que estamos en la rama correcta
BRANCH=$(git branch --show-current)
echo "📍 Rama actual: $BRANCH"

# Ejecutar tests y linting
echo "🔍 Ejecutando linting..."
npm run lint

if [ $? -ne 0 ]; then
    echo "❌ Error en el linting. Corrige los errores antes de continuar."
    exit 1
fi

# Build del proyecto
echo "🔨 Construyendo el proyecto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en el build. Verifica la configuración."
    exit 1
fi

# Agregar cambios a Git
echo "📝 Agregando cambios a Git..."
git add .

# Solicitar mensaje de commit
echo "💬 Ingresa el mensaje del commit:"
read COMMIT_MESSAGE

if [ -z "$COMMIT_MESSAGE" ]; then
    COMMIT_MESSAGE="feat: actualización del sistema SePrice"
fi

# Commit
git commit -m "$COMMIT_MESSAGE"

# Push a la rama actual
echo "⬆️ Subiendo cambios a GitHub..."
git push origin $BRANCH

echo "✅ Deployment completado!"
echo "🌐 El proyecto se desplegará automáticamente en Vercel"
echo "📱 Verifica el estado en: https://vercel.com/dashboard"