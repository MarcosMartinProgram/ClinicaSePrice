# SePrice - Sistema de Gestión de Clínica Médica

## 🏥 Descripción

SePrice es un sistema completo de gestión para clínicas médicas desarrollado con React y Tailwind CSS. Permite administrar pacientes, profesionales, especialidades, turnos y sala de espera con control de acceso basado en roles.

## ✨ Características Principales

### 🔐 Sistema de Autenticación

- Login con roles específicos (Recepcionista, Médico, Administrador)
- Control de acceso basado en permisos
- Navegación personalizada por rol

### 👥 Gestión de Pacientes

- Registro completo de pacientes con datos personales y médicos
- Historial médico y datos de contacto
- Búsqueda y filtrado avanzado por DNI, nombre y obra social
- CRUD completo con validaciones

### 👨‍⚕️ Gestión de Profesionales

- Administración completa de médicos y especialistas
- Configuración de horarios de trabajo personalizados
- Asignación de consultorios
- Vinculación con especialidades múltiples

### 🏥 Gestión de Especialidades

- Configuración detallada de especialidades médicas
- Duración personalizada de consultas
- Configuración de sobreturno
- Códigos de especialidad únicos

### 📅 Sistema de Turnos Avanzado

- Agenda médica completa con vista calendario y lista
- Reserva de turnos por recepcionista
- Sistema de auto-agendado para pacientes
- Filtros por profesional, especialidad y fecha
- Proceso de reserva en 4 pasos con validaciones

### ⏰ Sala de Espera en Tiempo Real

- Seguimiento en tiempo real de pacientes
- Estados dinámicos: En espera, En consulta, Atendido
- Gestión inteligente de consultorios
- Control automático de tiempos de espera
- Interfaz específica por rol de usuario

### ⏰ Sala de Espera

- Vista en tiempo real de pacientes
- Estados de atención
- Registro de llegadas
- Control de tiempos de espera
- Llamado a consultorios

### 📊 Reportes y Estadísticas

- Reportes por especialidad
- Estadísticas por médico
- Control de ausencias
- Análisis de sobreturnos
- Exportación a PDF/Excel

### ⚙️ Configuración del Sistema

- Gestión de usuarios
- Roles y permisos
- Personalización de la interfaz
- Configuraciones generales

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

1. **Clonar el repositorio**

   ```bash
   git clone [url-del-repositorio]
   cd SePrice
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   - El sistema estará disponible en `http://localhost:3001`

### Scripts Disponibles

```bash
npm run dev        # Inicia el servidor de desarrollo
npm run build      # Construye la aplicación para producción
npm run preview    # Previsualiza la versión de producción
npm run lint       # Ejecuta el linter para revisar el código
```

## 👤 Usuarios de Prueba

El sistema incluye usuarios de prueba preconfigurados:

| Rol               | Usuario     | Contraseña | Descripción                                 |
| ----------------- | ----------- | ---------- | ------------------------------------------- |
| **Recepcionista** | `recepcion` | `123456`   | Acceso a pacientes, turnos y sala de espera |
| **Médico**        | `doctor`    | `123456`   | Acceso a agenda personal y sala de espera   |
| **Administrador** | `admin`     | `123456`   | Acceso completo a todos los módulos         |

## 🏗️ Arquitectura del Proyecto

```
SePrice/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   └── Layout.jsx      # Layout principal con navegación
│   ├── pages/              # Páginas principales
│   │   ├── Login.jsx       # Página de inicio de sesión
│   │   ├── Dashboard.jsx   # Panel principal
│   │   ├── Patients.jsx    # Gestión de pacientes
│   │   ├── Professionals.jsx
│   │   ├── Specialties.jsx
│   │   ├── Appointments.jsx
│   │   ├── WaitingRoom.jsx
│   │   ├── Reports.jsx
│   │   └── Configuration.jsx
│   ├── context/            # Contextos de React
│   │   └── AuthContext.jsx # Manejo de autenticación
│   ├── utils/              # Utilidades y helpers
│   ├── index.css          # Estilos globales con Tailwind
│   ├── main.jsx           # Punto de entrada
│   └── App.jsx            # Componente principal con rutas
├── public/                # Archivos estáticos
├── package.json
├── vite.config.js        # Configuración de Vite
├── tailwind.config.js    # Configuración de Tailwind CSS
└── README.md
```

## 🎨 Tecnologías Utilizadas

- **Frontend**: React 18, Vite
- **Estilos**: Tailwind CSS
- **Enrutamiento**: React Router DOM
- **Iconos**: Lucide React
- **Estado**: React Context API
- **Accesibilidad**: Headless UI

## 🔒 Sistema de Permisos

### Recepcionista

- ✅ Panel Principal
- ✅ Gestión de Pacientes
- ✅ Gestión de Profesionales
- ✅ Especialidades
- ✅ Turnos
- ✅ Sala de Espera
- ❌ Reportes
- ❌ Configuración

### Médico

- ❌ Panel Principal
- ❌ Gestión de Pacientes
- ❌ Gestión de Profesionales
- ❌ Especialidades
- ✅ Turnos (Agenda personal)
- ✅ Sala de Espera
- ❌ Reportes
- ❌ Configuración

### Administrador

- ✅ Acceso completo a todos los módulos

## 📱 Características de la UI

- **Responsive Design**: Adaptado para desktop, tablet y móvil
- **Navegación Intuitiva**: Sidebar colapsible con iconos
- **Tema Coherente**: Paleta de colores profesional para clínica médica
- **Accesibilidad**: Componentes accesibles con navegación por teclado
- **Feedback Visual**: Estados de loading, errores y confirmaciones

## 🔧 Personalización

### Colores del Sistema

Los colores principales se pueden modificar en `tailwind.config.js`:

- **Primary**: Azul profesional para elementos principales
- **Secondary**: Verde/teal para elementos secundarios

### Logo de la Clínica

Para cambiar el logo, reemplazar el archivo en `/public/logo.svg`

### Configuraciones Adicionales

Las configuraciones del sistema se pueden modificar en el módulo de Configuración (solo administradores).

## 🚀 Deployment en Vercel

### Pre-requisitos

- Cuenta en [GitHub](https://github.com)
- Cuenta en [Vercel](https://vercel.com)
- Git instalado localmente

### Pasos para el Deploy

#### 1. Preparar el repositorio Git

```bash
# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "feat: sistema completo SePrice v1.0.0"

# Agregar origen remoto (reemplazar con tu URL)
git remote add origin https://github.com/tu-usuario/seprice-clinic.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

#### 2. Deploy en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en "New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Vite
5. Configuración automática:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### 3. Variables de Entorno (Opcional)

En Vercel → Settings → Environment Variables:

```
VITE_APP_NAME=SePrice
VITE_APP_VERSION=1.0.0
```

#### 4. Dominio Personalizado (Opcional)

- En Settings → Domains
- Agregar tu dominio personalizado

### 🔗 URLs de Demo

- **Desarrollo**: http://localhost:3001
- **Producción**: https://seprice-clinic.vercel.app (ejemplo)

### 📦 Scripts de Deployment

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint del código
npm run lint
```

### 🔄 Comandos Git Útiles

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/seprice-clinic.git

# Crear nueva rama para feature
git checkout -b feature/nueva-funcionalidad

# Agregar cambios
git add .
git commit -m "feat: descripción del cambio"

# Subir cambios
git push origin feature/nueva-funcionalidad

# Merge a main (después del Pull Request)
git checkout main
git pull origin main
```

## 🚀 Próximas Funcionalidades

- [ ] Integración con base de datos real
- [ ] Notificaciones push
- [ ] Chat interno entre profesionales
- [ ] Integración con sistemas de facturación
- [ ] App móvil nativa
- [ ] Telemedicina
- [ ] Integración con laboratorios
- [ ] Sistema de backup automático

## 🤝 Contribución

1. Fork del proyecto
2. Crear una rama para la nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de los cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## � Credenciales de Prueba

### Recepcionista

- **Usuario**: `recepcion`
- **Contraseña**: `123456`
- **Permisos**: Dashboard, Pacientes, Profesionales, Especialidades, Turnos, Sala de Espera

### Médico

- **Usuario**: `doctor`
- **Contraseña**: `123456`
- **Permisos**: Turnos, Sala de Espera

### Administrador

- **Usuario**: `admin`
- **Contraseña**: `123456`
- **Permisos**: Acceso completo a todos los módulos

## 📊 Datos de Prueba Incluidos

### Pacientes de Ejemplo

- Juan Pérez (DNI: 12345678) - OSDE
- María García (DNI: 87654321) - Swiss Medical
- Carlos López (DNI: 11223344) - PAMI

### Profesionales de Ejemplo

- Dr. Juan Martínez (Cardiología) - Consultorio 101
- Dra. Ana Rodríguez (Dermatología) - Consultorio 102
- Dr. Luis González (Traumatología) - Consultorio 103

### Especialidades Configuradas

- Cardiología (60 minutos por consulta)
- Dermatología (30 minutos por consulta)
- Traumatología (45 minutos por consulta)

## �📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para reportar bugs o solicitar nuevas funcionalidades, crear un issue en el repositorio del proyecto.

---

**SePrice** - Sistema de Gestión Clínica Médica
_Desarrollado con ❤️ para mejorar la gestión hospitalaria_

**¡El sistema está completamente funcional y listo para usar! 🚀**
