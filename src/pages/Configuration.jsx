import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { 
  Settings, 
  Users, 
  Shield, 
  Palette, 
  Building2,
  Clock,
  Database,
  Download,
  Upload,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit
} from 'lucide-react'

function Configuration() {
  const { patients, appointments, professionals, specialties } = useData()
  
  const [activeTab, setActiveTab] = useState('general')
  const [users, setUsers] = useState([])
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  
  // Configuración general
  const [clinicName, setClinicName] = useState('Clínica SePrice')
  const [clinicAddress, setClinicAddress] = useState('Av. Principal 123, Ciudad')
  const [clinicPhone, setClinicPhone] = useState('+54 11 1234-5678')
  const [clinicEmail, setClinicEmail] = useState('info@seprice.com')
  const [appointmentDuration, setAppointmentDuration] = useState(30)
  const [workStartTime, setWorkStartTime] = useState('08:00')
  const [workEndTime, setWorkEndTime] = useState('20:00')
  
  // Configuración de apariencia
  const [primaryColor, setPrimaryColor] = useState('#2563eb')
  const [theme, setTheme] = useState('light')

  // Cargar configuración desde localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('sepriceConfig')
    if (savedConfig) {
      const config = JSON.parse(savedConfig)
      setClinicName(config.clinicName || 'Clínica SePrice')
      setClinicAddress(config.clinicAddress || 'Av. Principal 123, Ciudad')
      setClinicPhone(config.clinicPhone || '+54 11 1234-5678')
      setClinicEmail(config.clinicEmail || 'info@seprice.com')
      setAppointmentDuration(config.appointmentDuration || 30)
      setWorkStartTime(config.workStartTime || '08:00')
      setWorkEndTime(config.workEndTime || '20:00')
      setPrimaryColor(config.primaryColor || '#2563eb')
      setTheme(config.theme || 'light')
    }

    const savedUsers = localStorage.getItem('sepriceUsers')
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      // Usuarios por defecto
      const defaultUsers = [
        { id: 1, username: 'admin', password: '123456', role: 'administrador', name: 'Administrador', email: 'admin@seprice.com', active: true },
        { id: 2, username: 'doctor', password: '123456', role: 'medico', name: 'Dr. García', email: 'garcia@seprice.com', active: true, professionalId: 1 },
        { id: 3, username: 'recepcion', password: '123456', role: 'recepcionista', name: 'María López', email: 'recepcion@seprice.com', active: true }
      ]
      setUsers(defaultUsers)
      localStorage.setItem('sepriceUsers', JSON.stringify(defaultUsers))
    }
  }, [])

  // Guardar configuración
  const saveConfiguration = () => {
    const config = {
      clinicName,
      clinicAddress,
      clinicPhone,
      clinicEmail,
      appointmentDuration,
      workStartTime,
      workEndTime,
      primaryColor,
      theme
    }
    localStorage.setItem('sepriceConfig', JSON.stringify(config))
    alert('Configuración guardada exitosamente')
  }

  // Gestión de usuarios
  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers)
    localStorage.setItem('sepriceUsers', JSON.stringify(updatedUsers))
  }

  const addUser = (newUser) => {
    const user = {
      ...newUser,
      id: Math.max(...users.map(u => u.id), 0) + 1,
      active: true
    }
    const updatedUsers = [...users, user]
    saveUsers(updatedUsers)
    setShowAddUserModal(false)
  }

  const updateUser = (userId, updates) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, ...updates } : u)
    saveUsers(updatedUsers)
    setEditingUser(null)
  }

  const toggleUserStatus = (userId) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, active: !u.active } : u
    )
    saveUsers(updatedUsers)
  }

  const deleteUser = (userId) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      const updatedUsers = users.filter(u => u.id !== userId)
      saveUsers(updatedUsers)
    }
  }

  // Backup y restauración
  const exportData = () => {
    const data = {
      config: {
        clinicName,
        clinicAddress,
        clinicPhone,
        clinicEmail,
        appointmentDuration,
        workStartTime,
        workEndTime,
        primaryColor,
        theme
      },
      users,
      appData: {
        patients,
        appointments,
        professionals,
        specialties
      },
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seprice_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const importData = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          
          if (window.confirm('¿Desea restaurar la configuración? Esto sobrescribirá los datos actuales.')) {
            // Restaurar configuración
            if (data.config) {
              localStorage.setItem('sepriceConfig', JSON.stringify(data.config))
            }
            // Restaurar usuarios
            if (data.users) {
              localStorage.setItem('sepriceUsers', JSON.stringify(data.users))
            }
            // Restaurar datos de la aplicación
            if (data.appData) {
              localStorage.setItem('sepriceData', JSON.stringify(data.appData))
            }
            
            alert('Datos restaurados exitosamente. La página se recargará.')
            window.location.reload()
          }
        } catch (error) {
          alert('Error al importar los datos. Verifique el archivo.')
        }
      }
      reader.readAsText(file)
    }
  }

  const resetToDefaults = () => {
    if (window.confirm('¿Está seguro de restaurar la configuración por defecto? Esto no afectará los datos de pacientes y turnos.')) {
      localStorage.removeItem('sepriceConfig')
      localStorage.removeItem('sepriceUsers')
      window.location.reload()
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Building2 },
    { id: 'users', name: 'Usuarios', icon: Users },
    { id: 'appearance', name: 'Apariencia', icon: Palette },
    { id: 'schedule', name: 'Horarios', icon: Clock },
    { id: 'backup', name: 'Backup', icon: Database }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
            <p className="text-gray-600 mt-1">Gestión de usuarios y configuraciones generales</p>
          </div>
          <Settings className="w-10 h-10 text-primary-600" />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Configuración General */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Información de la Clínica</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Clínica
                  </label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={clinicPhone}
                    onChange={(e) => setClinicPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={clinicAddress}
                    onChange={(e) => setClinicAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={clinicEmail}
                    onChange={(e) => setClinicEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={saveConfiguration} className="btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Configuración
                </button>
              </div>
            </div>
          )}

          {/* Gestión de Usuarios */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Usuarios del Sistema</h2>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Usuario
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'administrador' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'medico' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role === 'administrador' ? 'Administrador' :
                             user.role === 'medico' ? 'Médico' : 'Recepcionista'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className="text-blue-600 hover:text-blue-800"
                              title={user.active ? 'Desactivar' : 'Activar'}
                            >
                              {user.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="text-yellow-600 hover:text-yellow-800"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {user.id !== 1 && (
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Apariencia */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Personalización</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Principal
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-20 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Color utilizado en botones y elementos destacados
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tema
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                    <option value="auto">Automático</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Tema visual de la aplicación (próximamente)
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={saveConfiguration} className="btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Apariencia
                </button>
              </div>
            </div>
          )}

          {/* Horarios */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Configuración de Horarios</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración de Turnos (minutos)
                  </label>
                  <select
                    value={appointmentDuration}
                    onChange={(e) => setAppointmentDuration(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={15}>15 minutos</option>
                    <option value={20}>20 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>60 minutos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    value={workStartTime}
                    onChange={(e) => setWorkStartTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Fin
                  </label>
                  <input
                    type="time"
                    value={workEndTime}
                    onChange={(e) => setWorkEndTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Estos valores se utilizarán como configuración predeterminada 
                  para nuevos turnos y horarios de atención.
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={saveConfiguration} className="btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Horarios
                </button>
              </div>
            </div>
          )}

          {/* Backup y Restauración */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Backup y Restauración</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={exportData}
                  className="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Exportar Datos
                </button>

                <label className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 mr-2" />
                  Importar Datos
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={resetToDefaults}
                  className="flex items-center justify-center px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Restaurar Defecto
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Importante</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• <strong>Exportar:</strong> Crea una copia de seguridad completa del sistema</li>
                  <li>• <strong>Importar:</strong> Restaura datos desde un archivo de backup</li>
                  <li>• <strong>Restaurar:</strong> Vuelve a la configuración inicial (no afecta datos clínicos)</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Estadísticas del Sistema</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{patients.length}</p>
                    <p className="text-sm text-gray-600">Pacientes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{appointments.length}</p>
                    <p className="text-sm text-gray-600">Turnos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{professionals.length}</p>
                    <p className="text-sm text-gray-600">Profesionales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{users.length}</p>
                    <p className="text-sm text-gray-600">Usuarios</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Agregar Usuario */}
      {showAddUserModal && (
        <UserModal
          onClose={() => setShowAddUserModal(false)}
          onSave={addUser}
          professionals={professionals}
        />
      )}

      {/* Modal Editar Usuario */}
      {editingUser && (
        <UserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(userData) => updateUser(editingUser.id, userData)}
          professionals={professionals}
        />
      )}
    </div>
  )
}

// Componente Modal para Agregar/Editar Usuario
function UserModal({ user, onClose, onSave, professionals }) {
  const [formData, setFormData] = useState(user || {
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'recepcionista',
    professionalId: null
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.username || !formData.name || !formData.email) {
      alert('Por favor complete todos los campos obligatorios')
      return
    }
    if (!user && !formData.password) {
      alert('La contraseña es obligatoria para nuevos usuarios')
      return
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {user ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña {user ? '(dejar vacío para no cambiar)' : '*'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                required={!user}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="recepcionista">Recepcionista</option>
              <option value="medico">Médico</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          {formData.role === 'medico' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profesional Asociado
              </label>
              <select
                value={formData.professionalId || ''}
                onChange={(e) => setFormData({ ...formData, professionalId: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                {professionals.filter(p => p.status === 'activo').map(prof => (
                  <option key={prof.id} value={prof.id}>{prof.fullName}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {user ? 'Actualizar' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Configuration