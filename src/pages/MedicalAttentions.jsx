import React, { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  User, 
  Calendar,
  Stethoscope,
  Edit2,
  Eye,
  Trash2,
  Heart,
  ClipboardList
} from 'lucide-react'

function MedicalAttentions() {
  const { user } = useAuth()
  const { 
    medicalAttentions,
    appointments,
    patients,
    professionals,
    specialties,
    addMedicalAttention,
    updateMedicalAttention,
    deleteMedicalAttention,
    getPatientById,
    getProfessionalById,
    getSpecialtyById,
    getMedicalAttentionsByPatient,
    getMedicalAttentionsByProfessional
  } = useData()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterProfessional, setFilterProfessional] = useState('')
  const [filterPatient, setFilterPatient] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add', 'edit', 'view'
  const [selectedAttention, setSelectedAttention] = useState(null)

  // Filtrar atenciones según el rol
  const userAttentions = user.role === 'medico' && user.professionalId
    ? medicalAttentions.filter(attention => attention.professionalId === user.professionalId)
    : medicalAttentions

  // Aplicar filtros
  const filteredAttentions = userAttentions.filter(attention => {
    const patient = getPatientById(attention.patientId)
    const professional = getProfessionalById(attention.professionalId)
    
    const matchesSearch = !searchTerm || 
      attention.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.dni.includes(searchTerm)

    const matchesDate = !filterDate || attention.date === filterDate
    const matchesProfessional = !filterProfessional || attention.professionalId.toString() === filterProfessional
    const matchesPatient = !filterPatient || attention.patientId.toString() === filterPatient

    return matchesSearch && matchesDate && matchesProfessional && matchesPatient
  }).sort((a, b) => new Date(b.date) - new Date(a.date))

  const handleAddAttention = () => {
    setSelectedAttention(null)
    setModalMode('add')
    setShowModal(true)
  }

  const handleEditAttention = (attention) => {
    setSelectedAttention(attention)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleViewAttention = (attention) => {
    setSelectedAttention(attention)
    setModalMode('view')
    setShowModal(true)
  }

  const handleDeleteAttention = (attention) => {
    if (confirm('¿Está seguro de que desea eliminar esta atención médica?')) {
      deleteMedicalAttention(attention.id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Atenciones Médicas</h1>
          <p className="text-gray-600">Registro y consulta de atenciones médicas</p>
        </div>
        {user.role === 'medico' && (
          <button
            onClick={handleAddAttention}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Atención
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Diagnóstico, paciente o DNI..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {user.role !== 'medico' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profesional
              </label>
              <select
                value={filterProfessional}
                onChange={(e) => setFilterProfessional(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los profesionales</option>
                {professionals.map(prof => (
                  <option key={prof.id} value={prof.id}>{prof.fullName}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paciente
            </label>
            <select
              value={filterPatient}
              onChange={(e) => setFilterPatient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los pacientes</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de atenciones */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                {user.role !== 'medico' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesional
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnóstico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttentions.map((attention) => {
                const patient = getPatientById(attention.patientId)
                const professional = getProfessionalById(attention.professionalId)
                const specialty = getSpecialtyById(attention.specialtyId)
                
                return (
                  <tr key={attention.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(attention.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {patient?.firstName} {patient?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        DNI: {patient?.dni}
                      </div>
                    </td>
                    {user.role !== 'medico' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {professional?.fullName}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {specialty?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={attention.diagnosis}>
                        {attention.diagnosis}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewAttention(attention)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {user.role === 'medico' && (
                          <>
                            <button
                              onClick={() => handleEditAttention(attention)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAttention(attention)}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredAttentions.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron atenciones</h3>
            <p className="text-gray-600">
              {medicalAttentions.length === 0 
                ? 'Comienza registrando la primera atención médica' 
                : 'Prueba ajustando los filtros de búsqueda'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <MedicalAttentionModal
          mode={modalMode}
          attention={selectedAttention}
          onSave={(attentionData) => {
            if (modalMode === 'edit') {
              updateMedicalAttention(selectedAttention.id, attentionData)
            } else if (modalMode === 'add') {
              addMedicalAttention(attentionData)
            }
            setShowModal(false)
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

// Modal de atención médica
function MedicalAttentionModal({ mode, attention, onSave, onClose }) {
  const { 
    appointments,
    patients,
    professionals,
    specialties,
    getPatientById,
    getProfessionalById,
    getSpecialtyById
  } = useData()
  
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    appointmentId: attention?.appointmentId || '',
    patientId: attention?.patientId || '',
    professionalId: attention?.professionalId || '',
    specialtyId: attention?.specialtyId || '',
    date: attention?.date || new Date().toISOString().split('T')[0],
    diagnosis: attention?.diagnosis || '',
    treatment: attention?.treatment || '',
    observations: attention?.observations || '',
    attachments: attention?.attachments || []
  })

  const [errors, setErrors] = useState({})

  // Si es médico, filtrar turnos solo de ese profesional
  const userAppointments = user.role === 'medico' && user.professionalId
    ? appointments.filter(app => app.professionalId === user.professionalId && app.status === 'confirmado')
    : appointments.filter(app => app.status === 'confirmado')

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.patientId) {
      newErrors.patientId = 'Debe seleccionar un paciente'
    }
    
    if (!formData.professionalId) {
      newErrors.professionalId = 'Debe seleccionar un profesional'
    }
    
    if (!formData.specialtyId) {
      newErrors.specialtyId = 'Debe seleccionar una especialidad'
    }
    
    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'El diagnóstico es obligatorio'
    }
    
    if (!formData.treatment.trim()) {
      newErrors.treatment = 'El tratamiento es obligatorio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (mode === 'view') {
      onClose()
      return
    }
    
    if (!validateForm()) {
      return
    }

    onSave(formData)
  }

  const handleAppointmentChange = (appointmentId) => {
    const appointment = appointments.find(a => a.id === parseInt(appointmentId))
    if (appointment) {
      setFormData(prev => ({
        ...prev,
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        professionalId: appointment.professionalId,
        specialtyId: appointment.specialtyId,
        date: appointment.date
      }))
    }
  }

  const isReadonly = mode === 'view'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {mode === 'add' && 'Nueva Atención Médica'}
          {mode === 'edit' && 'Editar Atención Médica'}
          {mode === 'view' && 'Detalles de Atención Médica'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isReadonly && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Turno asociado (opcional)
              </label>
              <select
                value={formData.appointmentId}
                onChange={(e) => handleAppointmentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar turno...</option>
                {userAppointments.map(appointment => {
                  const patient = getPatientById(appointment.patientId)
                  const professional = getProfessionalById(appointment.professionalId)
                  return (
                    <option key={appointment.id} value={appointment.id}>
                      {appointment.date} - {appointment.time} | {patient?.firstName} {patient?.lastName} | {professional?.fullName}
                    </option>
                  )
                })}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paciente *
              </label>
              {isReadonly ? (
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  {(() => {
                    const patient = getPatientById(formData.patientId)
                    return `${patient?.firstName} ${patient?.lastName} (DNI: ${patient?.dni})`
                  })()}
                </div>
              ) : (
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientId: parseInt(e.target.value) }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.patientId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar paciente...</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} (DNI: {patient.dni})
                    </option>
                  ))}
                </select>
              )}
              {errors.patientId && <p className="text-red-500 text-sm mt-1">{errors.patientId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profesional *
              </label>
              {isReadonly ? (
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  {getProfessionalById(formData.professionalId)?.fullName}
                </div>
              ) : (
                <select
                  value={formData.professionalId}
                  onChange={(e) => setFormData(prev => ({ ...prev, professionalId: parseInt(e.target.value) }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.professionalId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar profesional...</option>
                  {professionals.map(professional => (
                    <option key={professional.id} value={professional.id}>
                      {professional.fullName}
                    </option>
                  ))}
                </select>
              )}
              {errors.professionalId && <p className="text-red-500 text-sm mt-1">{errors.professionalId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especialidad *
              </label>
              {isReadonly ? (
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  {getSpecialtyById(formData.specialtyId)?.name}
                </div>
              ) : (
                <select
                  value={formData.specialtyId}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialtyId: parseInt(e.target.value) }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.specialtyId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar especialidad...</option>
                  {specialties.map(specialty => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.specialtyId && <p className="text-red-500 text-sm mt-1">{errors.specialtyId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly={isReadonly}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnóstico *
            </label>
            <textarea
              value={formData.diagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
              rows="3"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.diagnosis ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Diagnóstico médico..."
              readOnly={isReadonly}
            />
            {errors.diagnosis && <p className="text-red-500 text-sm mt-1">{errors.diagnosis}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tratamiento *
            </label>
            <textarea
              value={formData.treatment}
              onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value }))}
              rows="3"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.treatment ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tratamiento prescrito..."
              readOnly={isReadonly}
            />
            {errors.treatment && <p className="text-red-500 text-sm mt-1">{errors.treatment}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              value={formData.observations}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observaciones adicionales..."
              readOnly={isReadonly}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {isReadonly ? 'Cerrar' : 'Cancelar'}
            </button>
            {!isReadonly && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {mode === 'edit' ? 'Actualizar' : 'Registrar'} Atención
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default MedicalAttentions