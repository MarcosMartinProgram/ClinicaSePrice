import React, { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { 
  Clock, 
  User, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Phone,
  Calendar
} from 'lucide-react'

function WaitingRoom() {
  const { 
    appointments,
    patients,
    professionals,
    specialties,
    updateAppointment,
    getPatientById,
    getProfessionalById,
    getSpecialtyById,
    getTodayAppointments
  } = useData()

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [currentTime, setCurrentTime] = useState(new Date())

  // Actualizar la hora actual cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Actualizar cada minuto

    return () => clearInterval(timer)
  }, [])

  // Obtener turnos del día seleccionado
  const dayAppointments = appointments.filter(app => app.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time))

  // Clasificar turnos por estado
  const waitingPatients = dayAppointments.filter(app => app.status === 'en-espera')
  const inConsultation = dayAppointments.filter(app => app.status === 'en-atencion')
  const completed = dayAppointments.filter(app => app.status === 'atendido')
  const pending = dayAppointments.filter(app => app.status === 'confirmado')

  const handleStatusChange = (appointmentId, newStatus) => {
    updateAppointment(appointmentId, { status: newStatus })
  }

  const calculateWaitTime = (appointmentTime) => {
    const [hours, minutes] = appointmentTime.split(':').map(Number)
    const appointmentDate = new Date()
    appointmentDate.setHours(hours, minutes, 0, 0)
    
    const diffMs = currentTime - appointmentDate
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 0) return 'Pendiente'
    if (diffMins === 0) return 'Ahora'
    return `${diffMins} min`
  }

  const getWaitTimeColor = (waitTime) => {
    if (waitTime === 'Pendiente' || waitTime === 'Ahora') return 'text-blue-600'
    const minutes = parseInt(waitTime)
    if (minutes <= 15) return 'text-green-600'
    if (minutes <= 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sala de Espera</h1>
          <p className="text-gray-600">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
          <div className="text-sm text-gray-600">
            {currentTime.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-blue-800 text-sm font-medium">Turnos del Día</p>
              <p className="text-2xl font-bold text-blue-900">{dayAppointments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-yellow-800 text-sm font-medium">En Espera</p>
              <p className="text-2xl font-bold text-yellow-900">{waitingPatients.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <User className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-green-800 text-sm font-medium">En Consulta</p>
              <p className="text-2xl font-bold text-green-900">{inConsultation.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <p className="text-gray-800 text-sm font-medium">Completados</p>
              <p className="text-2xl font-bold text-gray-900">{completed.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla principal de sala de espera */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Estado Actual de Pacientes</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Médico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultorio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dayAppointments.map((appointment) => {
                const patient = getPatientById(appointment.patientId)
                const professional = getProfessionalById(appointment.professionalId)
                const specialty = getSpecialtyById(appointment.specialtyId)
                const waitTime = calculateWaitTime(appointment.time)
                
                return (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {appointment.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-8 h-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {patient ? `${patient.firstName} ${patient.lastName}` : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {specialty?.name || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {professional?.fullName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 mr-1" />
                        {professional?.office || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        appointment.status === 'confirmado' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'en-espera' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'en-atencion' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'atendido' ? 'bg-gray-100 text-gray-800' :
                        appointment.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status === 'confirmado' ? 'Pendiente' :
                         appointment.status === 'en-espera' ? 'Esperando' :
                         appointment.status === 'en-atencion' ? 'En consulta' :
                         appointment.status === 'atendido' ? 'Atendido' :
                         appointment.status === 'cancelado' ? 'Cancelado' :
                         appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getWaitTimeColor(waitTime)}`}>
                        {waitTime}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {appointment.status === 'confirmado' && (
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'en-espera')}
                            className="text-blue-600 hover:text-blue-900"
                            title="Registrar llegada"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                        
                        {appointment.status === 'en-espera' && (
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'en-atencion')}
                            className="text-green-600 hover:text-green-900"
                            title="Llamar a consultorio"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        )}
                        
                        {appointment.status === 'en-atencion' && (
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'atendido')}
                            className="text-gray-600 hover:text-gray-900"
                            title="Marcar como atendido"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {(appointment.status === 'confirmado' || appointment.status === 'en-espera') && (
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'ausente')}
                            className="text-red-600 hover:text-red-900"
                            title="Marcar como ausente"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {dayAppointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay turnos programados para esta fecha.
          </div>
        )}
      </div>

      {/* Panel de consultorios */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Estado de Consultorios</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...new Set(professionals.map(p => p.office))].filter(Boolean).map(office => {
              const officeProfessionals = professionals.filter(p => p.office === office)
              const currentAppointment = dayAppointments.find(app => {
                const prof = getProfessionalById(app.professionalId)
                return prof?.office === office && app.status === 'en-atencion'
              })
              
              const isOccupied = !!currentAppointment
              const patient = currentAppointment ? getPatientById(currentAppointment.patientId) : null
              
              return (
                <div
                  key={office}
                  className={`border-2 rounded-lg p-4 ${
                    isOccupied 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{office}</h3>
                    <div className={`w-3 h-3 rounded-full ${
                      isOccupied ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div>Médicos: {officeProfessionals.map(p => p.fullName).join(', ')}</div>
                    {isOccupied && patient && (
                      <div className="mt-2 p-2 bg-white rounded border">
                        <div className="font-medium text-gray-900">
                          En consulta: {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          Desde las {currentAppointment.time}
                        </div>
                      </div>
                    )}
                    {!isOccupied && (
                      <div className="mt-2 text-gray-500">Disponible</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Botón de actualizar */}
      <div className="flex justify-center">
        <button
          onClick={() => setCurrentTime(new Date())}
          className="btn-secondary flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar Estado
        </button>
      </div>
    </div>
  )
}

export default WaitingRoom