import React, { useState } from 'react'
import { useData } from '../context/DataContext'
import { Search, Plus, Edit, Trash2, UserCheck, Calendar, Clock } from 'lucide-react'

function Professionals() {
  const { 
    professionals, 
    specialties, 
    addProfessional, 
    updateProfessional, 
    deleteProfessional,
    getSpecialtyById 
  } = useData()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedProfessional, setSelectedProfessional] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Filtrar profesionales
  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = 
      professional.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.license.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSpecialty = selectedSpecialty === '' || professional.specialtyId === parseInt(selectedSpecialty)
    
    return matchesSearch && matchesSpecialty
  })

  const handleAdd = () => {
    setModalMode('add')
    setSelectedProfessional({
      fullName: '',
      license: '',
      specialtyId: '',
      workDays: [],
      workHours: { start: '08:00', end: '16:00' },
      office: ''
    })
    setShowModal(true)
  }

  const handleEdit = (professional) => {
    setModalMode('edit')
    setSelectedProfessional(professional)
    setShowModal(true)
  }

  const handleDelete = (professional) => {
    setSelectedProfessional(professional)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    deleteProfessional(selectedProfessional.id)
    setShowDeleteConfirm(false)
    setSelectedProfessional(null)
  }

  const handleSave = (professionalData) => {
    if (modalMode === 'add') {
      addProfessional(professionalData)
    } else {
      updateProfessional(selectedProfessional.id, professionalData)
    }
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Profesionales</h1>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Profesional
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por nombre o matrícula
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar profesional..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especialidad
            </label>
            <select
              className="input-field"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">Todas las especialidades</option>
              {specialties.map(specialty => (
                <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de profesionales */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profesional
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horarios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultorio
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
              {filteredProfessionals.map((professional) => (
                <tr key={professional.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserCheck className="w-8 h-8 text-primary-600 mr-3" />
                      <div className="text-sm font-medium text-gray-900">
                        {professional.fullName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {professional.license}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getSpecialtyById(professional.specialtyId)?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="text-xs">
                      <div>{professional.workDays.join(', ')}</div>
                      <div className="text-gray-500">
                        {professional.workHours.start} - {professional.workHours.end}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {professional.office}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      professional.status === 'activo' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {professional.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(professional)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(professional)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProfessionals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron profesionales con los filtros aplicados.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProfessionalModal
          mode={modalMode}
          professional={selectedProfessional}
          specialties={specialties}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          professional={selectedProfessional}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false)
            setSelectedProfessional(null)
          }}
        />
      )}
    </div>
  )
}

// Modal para profesional
function ProfessionalModal({ mode, professional, specialties, onSave, onClose }) {
  const [formData, setFormData] = useState(professional)
  const [errors, setErrors] = useState({})

  const workDaysOptions = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miércoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sábado', label: 'Sábado' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleWorkDaysChange = (day) => {
    setFormData(prev => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter(d => d !== day)
        : [...prev.workDays, day]
    }))
  }

  const handleWorkHoursChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      workHours: {
        ...prev.workHours,
        [field]: value
      }
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName) newErrors.fullName = 'El nombre completo es obligatorio'
    if (!formData.license) newErrors.license = 'La matrícula es obligatoria'
    if (!formData.specialtyId) newErrors.specialtyId = 'La especialidad es obligatoria'
    if (!formData.office) newErrors.office = 'El consultorio es obligatorio'
    if (formData.workDays.length === 0) newErrors.workDays = 'Debe seleccionar al menos un día de trabajo'
    
    // Validar horarios
    if (formData.workHours.start >= formData.workHours.end) {
      newErrors.workHours = 'La hora de inicio debe ser menor a la hora de fin'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave({
        ...formData,
        specialtyId: parseInt(formData.specialtyId)
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'add' ? 'Nuevo Profesional' : 'Editar Profesional'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                placeholder="Ej: Dr. Juan Pérez"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matrícula *
              </label>
              <input
                type="text"
                name="license"
                value={formData.license}
                onChange={handleChange}
                className={`input-field ${errors.license ? 'border-red-500' : ''}`}
                placeholder="Ej: MN12345"
              />
              {errors.license && <p className="text-red-500 text-xs mt-1">{errors.license}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especialidad *
              </label>
              <select
                name="specialtyId"
                value={formData.specialtyId}
                onChange={handleChange}
                className={`input-field ${errors.specialtyId ? 'border-red-500' : ''}`}
              >
                <option value="">Seleccionar especialidad</option>
                {specialties.map(specialty => (
                  <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
                ))}
              </select>
              {errors.specialtyId && <p className="text-red-500 text-xs mt-1">{errors.specialtyId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consultorio *
              </label>
              <input
                type="text"
                name="office"
                value={formData.office}
                onChange={handleChange}
                className={`input-field ${errors.office ? 'border-red-500' : ''}`}
                placeholder="Ej: Consultorio 1"
              />
              {errors.office && <p className="text-red-500 text-xs mt-1">{errors.office}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días de Atención *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {workDaysOptions.map(day => (
                  <label key={day.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.workDays.includes(day.value)}
                      onChange={() => handleWorkDaysChange(day.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">{day.label}</span>
                  </label>
                ))}
              </div>
              {errors.workDays && <p className="text-red-500 text-xs mt-1">{errors.workDays}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Inicio *
              </label>
              <input
                type="time"
                value={formData.workHours.start}
                onChange={(e) => handleWorkHoursChange('start', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Fin *
              </label>
              <input
                type="time"
                value={formData.workHours.end}
                onChange={(e) => handleWorkHoursChange('end', e.target.value)}
                className="input-field"
              />
            </div>

            {errors.workHours && (
              <div className="md:col-span-2">
                <p className="text-red-500 text-xs">{errors.workHours}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {mode === 'add' ? 'Guardar Profesional' : 'Actualizar Profesional'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Modal de confirmación de eliminación
function ConfirmDeleteModal({ professional, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Confirmar Eliminación
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              ¿Está seguro que desea eliminar al profesional{' '}
              <strong>{professional.fullName}</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="flex justify-center space-x-3 mt-4">
            <button
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Professionals