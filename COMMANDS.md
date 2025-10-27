# Comandos útiles para SePrice

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
start http://localhost:3001
```

## Git y Versionado

```bash
# Inicializar repositorio
git init
git add .
git commit -m "feat: sistema inicial SePrice"

# Configurar remote (reemplazar con tu URL)
git remote add origin https://github.com/tu-usuario/seprice-clinic.git
git branch -M main
git push -u origin main

# Crear nueva rama
git checkout -b feature/nueva-funcionalidad

# Commits semánticos
git commit -m "feat: nueva funcionalidad"
git commit -m "fix: corrección de bug"
git commit -m "docs: actualización documentación"
git commit -m "style: mejoras visuales"
git commit -m "refactor: reestructuración código"
```

## Deploy en Vercel

```bash
# Opción 1: Automático desde GitHub
# 1. Subir código a GitHub
# 2. Conectar repo en vercel.com
# 3. Deploy automático en cada push

# Opción 2: CLI de Vercel
npm i -g vercel
vercel login
vercel --prod

# Verificar deployment
vercel --prod --confirm
```

## Mantenimiento

```bash
# Actualizar dependencias
npm update

# Auditar seguridad
npm audit
npm audit fix

# Limpiar caché
npm cache clean --force

# Reinstalar node_modules
rm -rf node_modules package-lock.json
npm install
```

## Debugging

```bash
# Build y revisar errores
npm run build

# Preview build local
npm run preview

# Analizar bundle
npm run build -- --mode=analyze
```

## Comandos Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy a preview
vercel

# Deploy a producción
vercel --prod

# Ver logs
vercel logs

# Configurar dominios
vercel domains

# Variables de entorno
vercel env add
vercel env list
```
