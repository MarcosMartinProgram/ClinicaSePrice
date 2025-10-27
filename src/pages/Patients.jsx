import React, { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { Search, Plus, Edit, Trash2, Eye, UserPlus, Calendar } from 'lucide-react'

function Patients() {
  const { 
    patients, 
    addPatient, 
    updatePatient, 
    deletePatient 
  } = useData()
  
  const [filteredPatients, setFilteredPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInsurance, setSelectedInsurance] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add', 'edit', 'view'
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Filtrado de pacientes
  useEffect(() => {
    let filtered = patients.filter(patient => {
      const matchesSearch = 
        patient.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesInsurance = selectedInsurance === '' || patient.insurance === selectedInsurance
      const matchesStatus = selectedStatus === '' || patient.status === selectedStatus
      
      return matchesSearch && matchesInsurance && matchesStatus
    })
    
    setFilteredPatients(filtered)
  }, [patients, searchTerm, selectedInsurance, selectedStatus])

  const handleAddPatient = () => {
    setModalMode('add')
    setSelectedPatient({
      dni: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      insurance: '',
      phone: '',
      address: '',
      email: ''
    })
    setShowModal(true)
  }

  const handleEditPatient = (patient) => {
    setModalMode('edit')
    setSelectedPatient(patient)
    setShowModal(true)
  }

  const handleViewPatient = (patient) => {
    setModalMode('view')
    setSelectedPatient(patient)
    setShowModal(true)
  }

  const handleDeletePatient = (patient) => {
    setSelectedPatient(patient)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    deletePatient(selectedPatient.id)
    setShowDeleteConfirm(false)
    setSelectedPatient(null)
  }

  const handleSavePatient = (patientData) => {
    if (modalMode === 'add') {
      addPatient(patientData)
    } else if (modalMode === 'edit') {
      updatePatient(selectedPatient.id, patientData)
    }
    setShowModal(false)
  }

  const calculateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const insurances = [...new Set(patients.map(p => p.insurance))].filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Pacientes</h1>
        <button
          onClick={handleAddPatient}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Paciente
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por DNI o Nombre
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar paciente..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Obra Social
            </label>
            <select
              className="input-field"
              value={selectedInsurance}
              onChange={(e) => setSelectedInsurance(e.target.value)}
            >
              <option value="">Todas las obras sociales</option>
              {insurances.map(insurance => (
                <option key={insurance} value={insurance}>{insurance}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              className="input-field"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de pacientes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre Completo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Obra Social
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
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
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.dni}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateAge(patient.birthDate)} años
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.insurance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      patient.status === 'activo' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewPatient(patient)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver ficha"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditPatient(patient)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePatient(patient)}
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
        
        {filteredPatients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron pacientes con los filtros aplicados.
          </div>
        )}
      </div>

      {/* Modal para agregar/editar/ver paciente */}
      {showModal && (
        <PatientModal
          mode={modalMode}
          patient={selectedPatient}
          onSave={handleSavePatient}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          patient={selectedPatient}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false)
            setSelectedPatient(null)
          }}
        />
      )}
    </div>
  )
}

// Componente Modal para paciente
function PatientModal({ mode, patient, onSave, onClose }) {
  const [formData, setFormData] = useState(patient)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.dni) newErrors.dni = 'El DNI es obligatorio'
    if (!formData.firstName) newErrors.firstName = 'El nombre es obligatorio'
    if (!formData.lastName) newErrors.lastName = 'El apellido es obligatorio'
    if (!formData.birthDate) newErrors.birthDate = 'La fecha de nacimiento es obligatoria'
    if (!formData.insurance) newErrors.insurance = 'La obra social es obligatoria'
    if (!formData.phone) newErrors.phone = 'El teléfono es obligatorio'
    
    // Validar edad coherente
    if (formData.birthDate) {
      const birthYear = new Date(formData.birthDate).getFullYear()
      const currentYear = new Date().getFullYear()
      const age = currentYear - birthYear
      
      if (age < 0 || age > 150) {
        newErrors.birthDate = 'Fecha de nacimiento inválida'
      }
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
    
    if (validateForm()) {
      onSave(formData)
    }
  }

  const calculateAge = (birthDate) => {
    if (!birthDate) return 0
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'add' ? 'Nuevo Paciente' : 
               mode === 'edit' ? 'Editar Paciente' : 'Ficha del Paciente'}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI *
              </label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={`input-field ${errors.dni ? 'border-red-500' : ''}`}
                placeholder="Ej: 12345678"
              />
              {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Obra Social *
              </label>
              <input
                type="text"
                name="insurance"
                value={formData.insurance}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={`input-field ${errors.insurance ? 'border-red-500' : ''}`}
                placeholder="Ej: OSDE"
              />
              {errors.insurance && <p className="text-red-500 text-xs mt-1">{errors.insurance}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                placeholder="Nombre del paciente"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                placeholder="Apellido del paciente"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={`input-field ${errors.birthDate ? 'border-red-500' : ''}`}
              />
              {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
              {formData.birthDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Edad: {calculateAge(formData.birthDate)} años
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={mode === 'view'}
                className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Ej: 11-2345-6789"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="input-field"
                placeholder="Dirección completa"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="input-field"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          {mode === 'view' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Acciones Rápidas</h4>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="btn-primary flex items-center"
                  onClick={() => {/* Lógica para solicitar turno */}}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Solicitar Turno
                </button>
                <button
                  type="button"
                  className="btn-secondary flex items-center"
                  onClick={() => {/* Lógica para ver historial */}}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Historial
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              {mode === 'view' ? 'Cerrar' : 'Cancelar'}
            </button>
            {mode !== 'view' && (
              <button
                type="submit"
                className="btn-primary"
              >
                {mode === 'add' ? 'Guardar Paciente' : 'Actualizar Paciente'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

// Componente Modal de confirmación de eliminación
function ConfirmDeleteModal({ patient, onConfirm, onCancel }) {
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
              ¿Está seguro que desea eliminar al paciente{' '}
              <strong>{patient.firstName} {patient.lastName}</strong>?
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

export default Patients