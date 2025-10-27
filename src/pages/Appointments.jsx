import React, { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Clock, 
  User, 
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw
} from 'lucide-react'

function Appointments() {
  const { user } = useAuth()
  const { 
    appointments, 
    patients, 
    professionals, 
    specialties,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    cancelAppointment,
    rescheduleAppointment,
    getPatientById,
    getProfessionalById,
    getSpecialtyById,
    getProfessionalsBySpecialty,
    checkAvailability,
    getAppointmentsByProfessional
  } = useData()

  const [view, setView] = useState('list') // 'list', 'new', 'agenda'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterProfessional, setFilterProfessional] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  // Filtrar turnos
  const filteredAppointments = appointments.filter(appointment => {
    const patient = getPatientById(appointment.patientId)
    const professional = getProfessionalById(appointment.professionalId)
    
    const matchesSearch = searchTerm === '' || (
      patient && (
        patient.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    
    const matchesStatus = filterStatus === '' || appointment.status === filterStatus
    const matchesProfessional = filterProfessional === '' || appointment.professionalId === parseInt(filterProfessional)
    const matchesDate = appointment.date === selectedDate
    
    return matchesSearch && matchesStatus && matchesProfessional && matchesDate
  })

  // Si es médico, mostrar solo sus turnos
  const userAppointments = user.role === 'medico' 
    ? filteredAppointments.filter(app => {
        const prof = getProfessionalById(app.professionalId)
        return prof && prof.fullName.includes(user.name.replace('Dr. ', '').replace('Dra. ', ''))
      })
    : filteredAppointments

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmado':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'en-espera':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'atendido':
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'cancelado':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'ausente':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800'
      case 'en-espera':
        return 'bg-yellow-100 text-yellow-800'
      case 'atendido':
        return 'bg-blue-100 text-blue-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      case 'ausente':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStatusChange = (appointmentId, newStatus) => {
    updateAppointment(appointmentId, { status: newStatus })
  }

  const generateTimeSlots = (professional) => {
    const slots = []
    const specialty = getSpecialtyById(professional.specialtyId)
    const duration = specialty?.duration || 30
    
    const [startHour, startMinute] = professional.workHours.start.split(':').map(Number)
    const [endHour, endMinute] = professional.workHours.end.split(':').map(Number)
    
    let currentTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute
    
    while (currentTime < endTime) {
      const hour = Math.floor(currentTime / 60)
      const minute = currentTime % 60
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      
      const isAvailable = checkAvailability(professional.id, selectedDate, timeStr)
      slots.push({
        time: timeStr,
        available: isAvailable
      })
      
      currentTime += duration
    }
    
    return slots
  }

  return (
    <div className="space-y-6">
      {/* Header y navegación */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">
          {user.role === 'medico' ? 'Mi Agenda' : 'Gestión de Turnos'}
        </h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg font-medium ${
              view === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Lista
          </button>
          {user.role !== 'medico' && (
            <button
              onClick={() => setView('new')}
              className={`px-4 py-2 rounded-lg font-medium ${
                view === 'new' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Nuevo Turno
            </button>
          )}
          <button
            onClick={() => setView('agenda')}
            className={`px-4 py-2 rounded-lg font-medium ${
              view === 'agenda' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Agenda
          </button>
        </div>
      </div>

      {/* Vista de lista de turnos */}
      {view === 'list' && (
        <>
          {/* Filtros */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar paciente
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="DNI o nombre..."
                    className="input-field pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  className="input-field"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="en-espera">En espera</option>
                  <option value="atendido">Atendido</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="ausente">Ausente</option>
                </select>
              </div>

              {user.role !== 'medico' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profesional
                  </label>
                  <select
                    className="input-field"
                    value={filterProfessional}
                    onChange={(e) => setFilterProfessional(e.target.value)}
                  >
                    <option value="">Todos los profesionales</option>
                    {professionals.map(professional => (
                      <option key={professional.id} value={professional.id}>
                        {professional.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Lista de turnos */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
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
                      Profesional
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Especialidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userAppointments.sort((a, b) => a.time.localeCompare(b.time)).map((appointment) => {
                    const patient = getPatientById(appointment.patientId)
                    const professional = getProfessionalById(appointment.professionalId)
                    const specialty = getSpecialtyById(appointment.specialtyId)
                    
                    return (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {appointment.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {patient ? `${patient.firstName} ${patient.lastName}` : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            DNI: {patient?.dni || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {professional?.fullName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {specialty?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(appointment.status)}
                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user.role === 'medico' ? (
                            <div className="flex space-x-2">
                              {appointment.status === 'confirmado' && (
                                <button
                                  onClick={() => handleStatusChange(appointment.id, 'atendido')}
                                  className="text-green-600 hover:text-green-900"
                                  title="Marcar como atendido"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              {appointment.status === 'confirmado' && (
                                <button
                                  onClick={() => handleStatusChange(appointment.id, 'ausente')}
                                  className="text-orange-600 hover:text-orange-900"
                                  title="Marcar como ausente"
                                >
                                  <AlertTriangle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setModalMode('edit')
                                  setSelectedAppointment(appointment)
                                  setShowModal(true)
                                }}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setShowRescheduleModal(true)
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                title="Reprogramar"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setShowCancelModal(true)
                                }}
                                className="text-red-600 hover:text-red-900"
                                title="Cancelar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            
            {userAppointments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay turnos para la fecha seleccionada.
              </div>
            )}
          </div>
        </>
      )}

      {/* Vista de nuevo turno */}
      {view === 'new' && user.role !== 'medico' && (
        <NewAppointmentForm 
          onSuccess={() => setView('list')}
        />
      )}

      {/* Vista de agenda */}
      {view === 'agenda' && (
        <AgendaView 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          userRole={user.role}
          userName={user.name}
        />
      )}

      {/* Modal de edición */}
      {showModal && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          onSave={(updates) => {
            updateAppointment(selectedAppointment.id, updates)
            setShowModal(false)
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Modal de cancelación */}
      {showCancelModal && (
        <CancelAppointmentModal
          appointment={selectedAppointment}
          onCancel={(reason) => {
            try {
              cancelAppointment(selectedAppointment.id, reason)
              setShowCancelModal(false)
              setSelectedAppointment(null)
              setCancelReason('')
            } catch (error) {
              alert(error.message)
            }
          }}
          onClose={() => {
            setShowCancelModal(false)
            setSelectedAppointment(null)
            setCancelReason('')
          }}
        />
      )}

      {/* Modal de reprogramación */}
      {showRescheduleModal && (
        <RescheduleAppointmentModal
          appointment={selectedAppointment}
          onReschedule={(newDate, newTime, reason) => {
            try {
              rescheduleAppointment(selectedAppointment.id, newDate, newTime, reason)
              setShowRescheduleModal(false)
              setSelectedAppointment(null)
            } catch (error) {
              alert(error.message)
            }
          }}
          onClose={() => {
            setShowRescheduleModal(false)
            setSelectedAppointment(null)
          }}
        />
      )}
    </div>
  )
}

// Componente para nuevo turno
function NewAppointmentForm({ onSuccess }) {
  const { 
    patients, 
    specialties, 
    professionals,
    addAppointment,
    addPatient,
    getProfessionalsBySpecialty,
    checkAvailability,
    getSpecialtyById
  } = useData()

  const [step, setStep] = useState(1) // 1: paciente, 2: especialidad, 3: profesional, 4: fecha/hora
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState(null)
  const [selectedProfessional, setSelectedProfessional] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState('')
  const [patientSearch, setPatientSearch] = useState('')
  const [showNewPatientForm, setShowNewPatientForm] = useState(false)
  const [notes, setNotes] = useState('')

  const filteredPatients = patients.filter(p => 
    p.dni.includes(patientSearch) || 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(patientSearch.toLowerCase())
  )

  const availableProfessionals = selectedSpecialty ? getProfessionalsBySpecialty(selectedSpecialty.id) : []

  const generateTimeSlots = () => {
    if (!selectedProfessional) return []
    
    const slots = []
    const specialty = getSpecialtyById(selectedProfessional.specialtyId)
    const duration = specialty?.duration || 30
    
    const [startHour, startMinute] = selectedProfessional.workHours.start.split(':').map(Number)
    const [endHour, endMinute] = selectedProfessional.workHours.end.split(':').map(Number)
    
    let currentTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute
    
    while (currentTime < endTime) {
      const hour = Math.floor(currentTime / 60)
      const minute = currentTime % 60
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      
      const isAvailable = checkAvailability(selectedProfessional.id, selectedDate, timeStr)
      slots.push({
        time: timeStr,
        available: isAvailable
      })
      
      currentTime += duration
    }
    
    return slots
  }

  const handleCreateAppointment = () => {
    const appointmentData = {
      patientId: selectedPatient.id,
      professionalId: selectedProfessional.id,
      specialtyId: selectedSpecialty.id,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmado',
      type: 'regular',
      notes
    }
    
    addAppointment(appointmentData)
    onSuccess()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Nuevo Turno</h2>
      
      {/* Indicador de pasos */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map(stepNum => (
          <div key={stepNum} className={`flex items-center ${stepNum < 4 ? 'flex-1' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNum ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNum}
            </div>
            {stepNum < 4 && (
              <div className={`flex-1 h-1 mx-2 ${
                step > stepNum ? 'bg-primary-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Seleccionar paciente */}
      {step === 1 && (
        <div>
          <h3 className="text-lg font-medium mb-4">1. Seleccionar Paciente</h3>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Buscar por DNI o nombre..."
                className="input-field"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
              />
            </div>
            
            <div className="max-h-64 overflow-y-auto border rounded-lg">
              {filteredPatients.map(patient => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedPatient?.id === patient.id ? 'bg-primary-50 border-primary-200' : ''
                  }`}
                >
                  <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                  <div className="text-sm text-gray-500">DNI: {patient.dni} - {patient.insurance}</div>
                </div>
              ))}
            </div>
            
            {filteredPatients.length === 0 && patientSearch && (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-2">No se encontró el paciente</p>
                <button
                  onClick={() => setShowNewPatientForm(true)}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar nuevo paciente
                </button>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedPatient}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Seleccionar especialidad */}
      {step === 2 && (
        <div>
          <h3 className="text-lg font-medium mb-4">2. Seleccionar Especialidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {specialties.map(specialty => (
              <div
                key={specialty.id}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedSpecialty?.id === specialty.id ? 'bg-primary-50 border-primary-200' : ''
                }`}
              >
                <div className="font-medium">{specialty.name}</div>
                <div className="text-sm text-gray-500">Duración: {specialty.duration} min</div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="btn-secondary">
              Anterior
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedSpecialty}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Seleccionar profesional */}
      {step === 3 && (
        <div>
          <h3 className="text-lg font-medium mb-4">3. Seleccionar Profesional</h3>
          <div className="space-y-4 mb-4">
            {availableProfessionals.map(professional => (
              <div
                key={professional.id}
                onClick={() => setSelectedProfessional(professional)}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedProfessional?.id === professional.id ? 'bg-primary-50 border-primary-200' : ''
                }`}
              >
                <div className="font-medium">{professional.fullName}</div>
                <div className="text-sm text-gray-500">
                  {professional.office} - {professional.workHours.start} a {professional.workHours.end}
                </div>
                <div className="text-sm text-gray-500">
                  Días: {professional.workDays.join(', ')}
                </div>
              </div>
            ))}
          </div>
          
          {availableProfessionals.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No hay profesionales disponibles para esta especialidad.
            </p>
          )}
          
          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="btn-secondary">
              Anterior
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!selectedProfessional}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Seleccionar fecha y hora */}
      {step === 4 && (
        <div>
          <h3 className="text-lg font-medium mb-4">4. Seleccionar Fecha y Hora</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setSelectedTime('') // Reset time when date changes
                }}
                min={new Date().toISOString().split('T')[0]}
                className="input-field max-w-xs"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horarios disponibles
              </label>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {generateTimeSlots().map(slot => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`p-2 text-sm border rounded-lg ${
                      selectedTime === slot.time
                        ? 'bg-primary-600 text-white border-primary-600'
                        : slot.available
                          ? 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field"
                rows="3"
                placeholder="Observaciones sobre el turno..."
              />
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(3)} className="btn-secondary">
              Anterior
            </button>
            <button
              onClick={handleCreateAppointment}
              disabled={!selectedTime}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Crear Turno
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente para vista de agenda
function AgendaView({ selectedDate, onDateChange, userRole, userName }) {
  const { 
    professionals, 
    appointments,
    getAppointmentsByProfessional,
    getPatientById,
    getSpecialtyById
  } = useData()

  const relevantProfessionals = userRole === 'medico' 
    ? professionals.filter(p => p.fullName.includes(userName.replace('Dr. ', '').replace('Dra. ', '')))
    : professionals

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Agenda - {new Date(selectedDate).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="input-field max-w-xs"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {relevantProfessionals.map(professional => {
          const dayAppointments = getAppointmentsByProfessional(professional.id, selectedDate)
          const specialty = getSpecialtyById(professional.specialtyId)
          
          return (
            <div key={professional.id} className="border rounded-lg p-4">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 text-primary-600 mr-2" />
                <div>
                  <h3 className="font-medium text-gray-900">{professional.fullName}</h3>
                  <p className="text-sm text-gray-500">{specialty?.name} - {professional.office}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {dayAppointments.sort((a, b) => a.time.localeCompare(b.time)).map(appointment => {
                  const patient = getPatientById(appointment.patientId)
                  return (
                    <div key={appointment.id} className={`p-2 rounded border-l-4 ${
                      appointment.status === 'confirmado' ? 'border-green-400 bg-green-50' :
                      appointment.status === 'en-espera' ? 'border-yellow-400 bg-yellow-50' :
                      appointment.status === 'atendido' ? 'border-blue-400 bg-blue-50' :
                      appointment.status === 'cancelado' ? 'border-red-400 bg-red-50' :
                      'border-gray-400 bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.time} - {patient ? `${patient.firstName} ${patient.lastName}` : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            DNI: {patient?.dni || 'N/A'}
                          </div>
                          {appointment.notes && (
                            <div className="text-xs text-gray-600 mt-1">
                              {appointment.notes}
                            </div>
                          )}
                        </div>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          appointment.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'en-espera' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.status === 'atendido' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  )
                })}
                
                {dayAppointments.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Sin turnos para este día
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Modal de edición de turno (simplificado)
function EditAppointmentModal({ appointment, onSave, onClose }) {
  const [status, setStatus] = useState(appointment.status)
  const [notes, setNotes] = useState(appointment.notes || '')

  const handleSave = () => {
    onSave({ status, notes })
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Turno</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-field"
              >
                <option value="confirmado">Confirmado</option>
                <option value="en-espera">En espera</option>
                <option value="atendido">Atendido</option>
                <option value="cancelado">Cancelado</option>
                <option value="ausente">Ausente</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field"
                rows="3"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="btn-primary"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal de cancelación de turno
function CancelAppointmentModal({ appointment, onCancel, onClose }) {
  const [reason, setReason] = useState('')
  const { getPatientById, getProfessionalById } = useData()
  
  const patient = getPatientById(appointment.patientId)
  const professional = getProfessionalById(appointment.professionalId)

  const handleCancel = () => {
    if (!reason.trim()) {
      alert('Debe ingresar un motivo para la cancelación')
      return
    }
    onCancel(reason)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cancelar Turno</h3>
          
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-sm"><strong>Paciente:</strong> {patient?.firstName} {patient?.lastName}</p>
            <p className="text-sm"><strong>Profesional:</strong> {professional?.fullName}</p>
            <p className="text-sm"><strong>Fecha:</strong> {appointment.date} a las {appointment.time}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de cancelación *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field"
              rows="3"
              placeholder="Ingrese el motivo de la cancelación..."
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cerrar
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Cancelar Turno
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal de reprogramación de turno
function RescheduleAppointmentModal({ appointment, onReschedule, onClose }) {
  const [newDate, setNewDate] = useState(appointment.date)
  const [newTime, setNewTime] = useState(appointment.time)
  const [reason, setReason] = useState('')
  
  const { 
    getPatientById, 
    getProfessionalById, 
    getSpecialtyById,
    checkAvailability 
  } = useData()
  
  const patient = getPatientById(appointment.patientId)
  const professional = getProfessionalById(appointment.professionalId)
  const specialty = getSpecialtyById(appointment.specialtyId)

  const generateTimeSlots = () => {
    if (!professional) return []
    
    const slots = []
    const duration = specialty?.duration || 30
    
    const [startHour, startMinute] = professional.workHours.start.split(':').map(Number)
    const [endHour, endMinute] = professional.workHours.end.split(':').map(Number)
    
    let currentTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute
    
    while (currentTime < endTime) {
      const hour = Math.floor(currentTime / 60)
      const minute = currentTime % 60
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      
      const isAvailable = checkAvailability(professional.id, newDate, timeStr, appointment.id)
      slots.push({
        time: timeStr,
        available: isAvailable
      })
      
      currentTime += duration
    }
    
    return slots
  }

  const handleReschedule = () => {
    if (!reason.trim()) {
      alert('Debe ingresar un motivo para la reprogramación')
      return
    }
    
    if (newDate === appointment.date && newTime === appointment.time) {
      alert('Debe seleccionar una fecha y hora diferente')
      return
    }
    
    onReschedule(newDate, newTime, reason)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Reprogramar Turno</h3>
          
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-sm"><strong>Paciente:</strong> {patient?.firstName} {patient?.lastName}</p>
            <p className="text-sm"><strong>Profesional:</strong> {professional?.fullName}</p>
            <p className="text-sm"><strong>Turno actual:</strong> {appointment.date} a las {appointment.time}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva fecha
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => {
                  setNewDate(e.target.value)
                  setNewTime('') // Reset time when date changes
                }}
                min={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nuevo horario
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {generateTimeSlots().map(slot => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && setNewTime(slot.time)}
                    disabled={!slot.available}
                    className={`p-2 text-sm border rounded-lg ${
                      newTime === slot.time
                        ? 'bg-primary-600 text-white border-primary-600'
                        : slot.available
                          ? 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de reprogramación *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input-field"
                rows="2"
                placeholder="Ingrese el motivo de la reprogramación..."
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cerrar
            </button>
            <button
              onClick={handleReschedule}
              disabled={!newTime || !reason.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reprogramar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appointments