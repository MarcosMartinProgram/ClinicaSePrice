import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Users,
  UserCheck,
  Stethoscope,
  Calendar,
  Clock,
  FileText,
  Settings,
  Activity,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

function Dashboard() {
  const { user } = useAuth()

  // Datos estadísticos de ejemplo
  const stats = [
    {
      name: 'Pacientes Registrados',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Turnos Hoy',
      value: '48',
      change: '+8',
      changeType: 'increase',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      name: 'En Sala de Espera',
      value: '7',
      change: '-2',
      changeType: 'decrease',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      name: 'Profesionales Activos',
      value: '12',
      change: '0',
      changeType: 'neutral',
      icon: UserCheck,
      color: 'bg-purple-500'
    }
  ]

  // Accesos rápidos basados en rol
  const getQuickActions = () => {
    const actions = []

    if (user.role === 'recepcionista' || user.role === 'administrador') {
      actions.push(
        { name: 'Nuevo Paciente', href: '/patients', icon: Users, description: 'Registrar un nuevo paciente' },
        { name: 'Nuevo Turno', href: '/appointments', icon: Calendar, description: 'Agendar nuevo turno' },
        { name: 'Sala de Espera', href: '/waiting-room', icon: Clock, description: 'Ver pacientes en espera' }
      )
    }

    if (user.role === 'administrador') {
      actions.push(
        { name: 'Reportes', href: '/reports', icon: FileText, description: 'Ver reportes del sistema' },
        { name: 'Configuración', href: '/configuration', icon: Settings, description: 'Configurar sistema' }
      )
    }

    return actions
  }

  const quickActions = getQuickActions()

  // Próximos turnos (datos de ejemplo)
  const upcomingAppointments = [
    {
      id: 1,
      patient: 'María González',
      doctor: 'Dr. Pérez',
      specialty: 'Cardiología',
      time: '09:00',
      status: 'confirmado'
    },
    {
      id: 2,
      patient: 'Juan López',
      doctor: 'Dra. Martínez',
      specialty: 'Dermatología',
      time: '09:30',
      status: 'en-espera'
    },
    {
      id: 3,
      patient: 'Ana Rodríguez',
      doctor: 'Dr. García',
      specialty: 'Traumatología',
      time: '10:00',
      status: 'confirmado'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800'
      case 'en-espera':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con saludo */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              ¡Bienvenido, {user.name}!
            </h1>
            <p className="text-gray-600 capitalize">
              Panel de {user.role} - {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <Activity className="h-8 w-8 text-primary-600" />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.changeType === 'increase' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : stat.changeType === 'decrease' ? (
                <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
              ) : (
                <div className="h-4 w-4" />
              )}
              <span className={`ml-1 text-sm ${
                stat.changeType === 'increase' ? 'text-green-600' :
                stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.change} desde ayer
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Accesos rápidos */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Accesos Rápidos</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  to={action.href}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <action.icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{action.name}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Próximos turnos */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Próximos Turnos</h2>
              <Link
                to="/appointments"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Ver todos
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
                    <p className="text-xs text-gray-500">
                      {appointment.doctor} - {appointment.specialty}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {appointment.time}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alertas y notificaciones */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Alertas del Sistema</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">
                  Recordatorio: Backup diario programado para las 23:00
                </p>
                <p className="text-xs text-yellow-600">
                  Asegúrese de que todos los usuarios estén desconectados
                </p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  3 pacientes tienen citas pendientes de confirmación
                </p>
                <p className="text-xs text-blue-600">
                  Revisar y confirmar en el módulo de turnos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard