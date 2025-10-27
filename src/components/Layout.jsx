import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Users,
  UserCheck,
  Stethoscope,
  Calendar,
  Clock,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Building,
  Heart
} from 'lucide-react'

function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Menú de navegación basado en roles
  const getNavigationItems = () => {
    const items = []

    // Elementos comunes
    if (user.role === 'recepcionista' || user.role === 'administrador') {
      items.push(
        { name: 'Panel Principal', href: '/dashboard', icon: Home },
        { name: 'Pacientes', href: '/patients', icon: Users },
        { name: 'Profesionales', href: '/professionals', icon: UserCheck },
        { name: 'Especialidades', href: '/specialties', icon: Stethoscope },
        { name: 'Consultorios', href: '/offices', icon: Building },
      )
    }

    // Turnos - todos los roles
    items.push({ name: 'Turnos', href: '/appointments', icon: Calendar })

    // Atenciones médicas - solo médicos y administradores
    if (user.role === 'medico' || user.role === 'administrador') {
      items.push({ name: 'Atenciones Médicas', href: '/medical-attentions', icon: Heart })
    }

    // Sala de espera - todos los roles
    items.push({ name: 'Sala de Espera', href: '/waiting-room', icon: Clock })

    // Solo administrador
    if (user.role === 'administrador') {
      items.push(
        { name: 'Reportes', href: '/reports', icon: FileText },
        { name: 'Configuración', href: '/configuration', icon: Settings }
      )
    }

    return items
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar para móvil */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        
        <nav className={`fixed top-0 left-0 bottom-0 flex flex-col w-64 max-w-xs pb-4 bg-white border-r border-gray-200 transition transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Header del sidebar móvil */}
          <div className="flex items-center justify-between flex-shrink-0 px-4 py-4 border-b">
            <img
              className="w-8 h-8"
              src="/logo.svg"
              alt="SePrice"
            />
            <span className="ml-2 text-xl font-semibold text-gray-900">SePrice</span>
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navegación móvil */}
          <div className="flex flex-col flex-1 px-4 py-4">
            <nav className="flex-1 space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </nav>
      </div>

      {/* Sidebar para desktop */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pb-4">
        {/* Header del sidebar */}
        <div className="flex items-center flex-shrink-0 px-6 py-4 border-b">
          <img
            className="w-8 h-8"
            src="/logo.svg"
            alt="SePrice"
          />
          <span className="ml-2 text-xl font-semibold text-gray-900">SePrice</span>
        </div>

        {/* Navegación desktop */}
        <div className="flex flex-col flex-1 px-4 py-4">
          <nav className="flex-1 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header superior */}
        <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200 lg:px-6">
          <div className="flex items-center">
            {/* Botón menú móvil */}
            <button
              type="button"
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Título de la página */}
            <h1 className="ml-2 text-2xl font-semibold text-gray-900 lg:ml-0">
              {navigationItems.find(item => item.href === location.pathname)?.name || 'SePrice'}
            </h1>
          </div>

          {/* Usuario y logout */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{user.name}</span>
              <span className="block text-xs capitalize">{user.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </button>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout