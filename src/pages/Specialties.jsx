import React, { useState } from 'react'
import { useData } from '../context/DataContext'
import { Search, Plus, Edit, Trash2, Stethoscope, Clock, CheckCircle, XCircle } from 'lucide-react'

function Specialties() {
  const { 
    specialties, 
    addSpecialty, 
    updateSpecialty, 
    deleteSpecialty 
  } = useData()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedSpecialty, setSelectedSpecialty] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Filtrar especialidades
  const filteredSpecialties = specialties.filter(specialty =>
    specialty.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setModalMode('add')
    setSelectedSpecialty({
      name: '',
      duration: 30,
      allowOverbooking: false,
      description: ''
    })
    setShowModal(true)
  }

  const handleEdit = (specialty) => {
    setModalMode('edit')
    setSelectedSpecialty(specialty)
    setShowModal(true)
  }

  const handleDelete = (specialty) => {
    setSelectedSpecialty(specialty)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    deleteSpecialty(selectedSpecialty.id)
    setShowDeleteConfirm(false)
    setSelectedSpecialty(null)
  }

  const handleSave = (specialtyData) => {
    if (modalMode === 'add') {
      addSpecialty(specialtyData)
    } else {
      updateSpecialty(selectedSpecialty.id, specialtyData)
    }
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Especialidades</h1>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Especialidad
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar especialidad
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid de especialidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpecialties.map((specialty) => (
          <div key={specialty.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Stethoscope className="w-8 h-8 text-primary-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">{specialty.name}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(specialty)}
                  className="text-yellow-600 hover:text-yellow-900"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(specialty)}
                  className="text-red-600 hover:text-red-900"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>Duración: {specialty.duration} minutos</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                {specialty.allowOverbooking ? (
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 mr-2 text-red-500" />
                )}
                <span>
                  {specialty.allowOverbooking ? 'Permite sobreturnos' : 'No permite sobreturnos'}
                </span>
              </div>

              {specialty.description && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {specialty.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSpecialties.length === 0 && (
        <div className="text-center py-12">
          <Stethoscope className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay especialidades</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No se encontraron especialidades con ese nombre.' : 'Comienza agregando tu primera especialidad.'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAdd}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Especialidad
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <SpecialtyModal
          mode={modalMode}
          specialty={selectedSpecialty}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          specialty={selectedSpecialty}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false)
            setSelectedSpecialty(null)
          }}
        />
      )}
    </div>
  )
}

// Modal para especialidad
function SpecialtyModal({ mode, specialty, onSave, onClose }) {
  const [formData, setFormData] = useState(specialty)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio'
    if (!formData.duration || formData.duration <= 0) newErrors.duration = 'La duración debe ser mayor a 0'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave({
        ...formData,
        duration: parseInt(formData.duration)
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'add' ? 'Nueva Especialidad' : 'Editar Especialidad'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Especialidad *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Ej: Cardiología"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración del Turno (minutos) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={`input-field ${errors.duration ? 'border-red-500' : ''}`}
                placeholder="30"
                min="1"
              />
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="allowOverbooking"
                id="allowOverbooking"
                checked={formData.allowOverbooking}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="allowOverbooking" className="text-sm font-medium text-gray-700">
                Permite sobreturnos
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Descripción de la especialidad..."
              />
            </div>
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
              {mode === 'add' ? 'Guardar Especialidad' : 'Actualizar Especialidad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Modal de confirmación de eliminación
function ConfirmDeleteModal({ specialty, onConfirm, onCancel }) {
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
              ¿Está seguro que desea eliminar la especialidad{' '}
              <strong>{specialty.name}</strong>?
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

export default Specialties