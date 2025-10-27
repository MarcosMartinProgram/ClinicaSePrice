import React, { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext()

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

// Datos iniciales de ejemplo
const initialData = {
  patients: [
    {
      id: 1,
      dni: '12345678',
      firstName: 'María',
      lastName: 'González',
      birthDate: '1985-03-15',
      insurance: 'OSDE',
      phone: '11-2345-6789',
      address: 'Av. Corrientes 1234, CABA',
      email: 'maria.gonzalez@email.com',
      status: 'activo'
    },
    {
      id: 2,
      dni: '87654321',
      firstName: 'Juan',
      lastName: 'Pérez',
      birthDate: '1978-07-22',
      insurance: 'Swiss Medical',
      phone: '11-8765-4321',
      address: 'Rivadavia 5678, CABA',
      email: 'juan.perez@email.com',
      status: 'activo'
    }
  ],
  specialties: [
    {
      id: 1,
      name: 'Cardiología',
      duration: 30,
      allowOverbooking: true,
      description: 'Especialidad médica que se ocupa del corazón y sistema circulatorio'
    },
    {
      id: 2,
      name: 'Dermatología',
      duration: 20,
      allowOverbooking: false,
      description: 'Especialidad médica que estudia la piel y sus enfermedades'
    },
    {
      id: 3,
      name: 'Traumatología',
      duration: 25,
      allowOverbooking: true,
      description: 'Especialidad que trata lesiones del aparato locomotor'
    }
  ],
  professionals: [
    {
      id: 1,
      fullName: 'Dr. Juan Carlos Pérez',
      license: 'MN12345',
      specialtyId: 1,
      workDays: ['lunes', 'martes', 'miércoles', 'viernes'],
      workHours: { start: '08:00', end: '16:00' },
      office: 'Consultorio 1',
      status: 'activo'
    },
    {
      id: 2,
      fullName: 'Dra. Ana María López',
      license: 'MN54321',
      specialtyId: 2,
      workDays: ['lunes', 'miércoles', 'jueves', 'viernes'],
      workHours: { start: '09:00', end: '17:00' },
      office: 'Consultorio 2',
      status: 'activo'
    },
    {
      id: 3,
      fullName: 'Dr. Carlos Roberto García',
      license: 'MN98765',
      specialtyId: 3,
      workDays: ['martes', 'miércoles', 'jueves', 'viernes'],
      workHours: { start: '08:30', end: '15:30' },
      office: 'Consultorio 1',
      status: 'activo'
    }
  ],
  offices: [
    {
      id: 1,
      name: 'Consultorio 1',
      location: 'Planta Baja - Ala Norte',
      equipment: ['Camilla', 'Escritorio', 'Tensiómetro', 'Estetoscopio'],
      capacity: 1,
      status: 'activo',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Consultorio 2',
      location: 'Planta Baja - Ala Sur',
      equipment: ['Camilla', 'Escritorio', 'Dermatoscopio', 'Lámpara especial'],
      capacity: 1,
      status: 'activo',
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Consultorio 3',
      location: 'Primer Piso - Ala Este',
      equipment: ['Camilla', 'Escritorio', 'Equipo de rayos X portátil'],
      capacity: 1,
      status: 'activo',
      createdAt: new Date().toISOString()
    }
  ],
  appointments: [
    {
      id: 1,
      patientId: 1,
      professionalId: 1,
      specialtyId: 1,
      date: '2025-10-23',
      time: '09:00',
      status: 'confirmado',
      type: 'regular',
      notes: 'Control rutinario',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      patientId: 2,
      professionalId: 2,
      specialtyId: 2,
      date: '2025-10-23',
      time: '10:30',
      status: 'en-espera',
      type: 'regular',
      notes: 'Primera consulta',
      createdAt: new Date().toISOString()
    }
  ],
  medicalAttentions: [
    {
      id: 1,
      appointmentId: 1,
      patientId: 1,
      professionalId: 1,
      specialtyId: 1,
      date: '2025-10-23',
      diagnosis: 'Control rutinario cardiovascular',
      treatment: 'Continuar con medicación actual. Control en 3 meses.',
      observations: 'Paciente en buen estado general. Presión arterial normal.',
      attachments: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      appointmentId: 2,
      patientId: 2,
      professionalId: 2,
      specialtyId: 2,
      date: '2025-10-23',
      diagnosis: 'Dermatitis atópica leve',
      treatment: 'Crema hidratante diaria, evitar alérgenos conocidos',
      observations: 'Primera consulta. Lesiones menores en extremidades superiores.',
      attachments: [],
      createdAt: new Date().toISOString()
    }
  ]
}

export function DataProvider({ children }) {
  const [patients, setPatients] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [professionals, setProfessionals] = useState([])
  const [appointments, setAppointments] = useState([])
  const [offices, setOffices] = useState([])
  const [medicalAttentions, setMedicalAttentions] = useState([])

  useEffect(() => {
    // Cargar datos del localStorage o usar datos iniciales
    const savedData = localStorage.getItem('sepriceData')
    if (savedData) {
      const data = JSON.parse(savedData)
      setPatients(data.patients || initialData.patients)
      setSpecialties(data.specialties || initialData.specialties)
      setProfessionals(data.professionals || initialData.professionals)
      setAppointments(data.appointments || initialData.appointments)
      setOffices(data.offices || initialData.offices)
      setMedicalAttentions(data.medicalAttentions || initialData.medicalAttentions)
    } else {
      setPatients(initialData.patients)
      setSpecialties(initialData.specialties)
      setProfessionals(initialData.professionals)
      setAppointments(initialData.appointments)
      setOffices(initialData.offices)
      setMedicalAttentions(initialData.medicalAttentions)
    }
  }, [])

  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    const data = { patients, specialties, professionals, appointments, offices, medicalAttentions }
    localStorage.setItem('sepriceData', JSON.stringify(data))
  }, [patients, specialties, professionals, appointments])

  // Funciones para pacientes
  const addPatient = (patient) => {
    const newPatient = {
      ...patient,
      id: Math.max(0, ...patients.map(p => p.id)) + 1,
      status: 'activo'
    }
    setPatients([...patients, newPatient])
    return newPatient
  }

  const updatePatient = (id, updates) => {
    setPatients(patients.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deletePatient = (id) => {
    setPatients(patients.filter(p => p.id !== id))
  }

  // Funciones para especialidades
  const addSpecialty = (specialty) => {
    const newSpecialty = {
      ...specialty,
      id: Math.max(0, ...specialties.map(s => s.id)) + 1
    }
    setSpecialties([...specialties, newSpecialty])
    return newSpecialty
  }

  const updateSpecialty = (id, updates) => {
    setSpecialties(specialties.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteSpecialty = (id) => {
    setSpecialties(specialties.filter(s => s.id !== id))
  }

  // Funciones para profesionales
  const addProfessional = (professional) => {
    const newProfessional = {
      ...professional,
      id: Math.max(0, ...professionals.map(p => p.id)) + 1,
      status: 'activo'
    }
    setProfessionals([...professionals, newProfessional])
    return newProfessional
  }

  const updateProfessional = (id, updates) => {
    setProfessionals(professionals.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deleteProfessional = (id) => {
    setProfessionals(professionals.filter(p => p.id !== id))
  }

  // Funciones para turnos
  const addAppointment = (appointment) => {
    const newAppointment = {
      ...appointment,
      id: Math.max(0, ...appointments.map(a => a.id)) + 1,
      createdAt: new Date().toISOString()
    }
    setAppointments([...appointments, newAppointment])
    return newAppointment
  }

  const updateAppointment = (id, updates) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, ...updates } : a))
  }

  const deleteAppointment = (id) => {
    setAppointments(appointments.filter(a => a.id !== id))
  }

  const cancelAppointment = (id, reason) => {
    const appointment = appointments.find(a => a.id === id)
    if (appointment) {
      updateAppointment(id, {
        status: 'cancelado',
        cancelReason: reason,
        cancelDate: new Date().toISOString()
      })
    }
  }

  const rescheduleAppointment = (id, newDate, newTime, reason) => {
    const appointment = appointments.find(a => a.id === id)
    if (appointment) {
      // Verificar disponibilidad en la nueva fecha y hora
      if (!checkAvailability(appointment.professionalId, newDate, newTime, id)) {
        throw new Error('El horario seleccionado no está disponible')
      }
      
      updateAppointment(id, {
        date: newDate,
        time: newTime,
        rescheduleReason: reason,
        rescheduleDate: new Date().toISOString(),
        previousDate: appointment.date,
        previousTime: appointment.time
      })
    }
  }

  // Funciones de utilidad
  const getPatientById = (id) => patients.find(p => p.id === id)
  const getProfessionalById = (id) => professionals.find(p => p.id === id)
  const getSpecialtyById = (id) => specialties.find(s => s.id === id)
  
  const getProfessionalsBySpecialty = (specialtyId) => 
    professionals.filter(p => p.specialtyId === specialtyId && p.status === 'activo')

  const getAppointmentsByDate = (date) =>
    appointments.filter(a => a.date === date)

  const getAppointmentsByProfessional = (professionalId, date) =>
    appointments.filter(a => a.professionalId === professionalId && a.date === date)

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0]
    return appointments.filter(a => a.date === today)
  }

  const checkAvailability = (professionalId, date, time, excludeId = null) => {
    return !appointments.some(a => 
      a.professionalId === professionalId && 
      a.date === date && 
      a.time === time && 
      a.id !== excludeId &&
      a.status !== 'cancelado'
    )
  }

  // Office functions
  const addOffice = (office) => {
    const newOffice = {
      ...office,
      id: Math.max(...offices.map(o => o.id), 0) + 1,
      createdAt: new Date().toISOString()
    }
    setOffices([...offices, newOffice])
    return newOffice
  }

  const updateOffice = (id, updates) => {
    setOffices(offices.map(o => o.id === id ? { ...o, ...updates } : o))
  }

  const deleteOffice = (id) => {
    // Verificar que no esté siendo usado en agendas activas
    const isInUse = professionals.some(p => p.office === getOfficeById(id)?.name && p.status === 'activo')
    if (isInUse) {
      throw new Error('No se puede eliminar el consultorio porque está siendo usado por profesionales activos')
    }
    setOffices(offices.filter(o => o.id !== id))
  }

  const getOfficeById = (id) => offices.find(o => o.id === id)

  const getAvailableOffices = () => offices.filter(o => o.status === 'activo')

  // Medical Attention functions
  const addMedicalAttention = (attention) => {
    const newAttention = {
      ...attention,
      id: Math.max(...medicalAttentions.map(a => a.id), 0) + 1,
      createdAt: new Date().toISOString()
    }
    setMedicalAttentions([...medicalAttentions, newAttention])
    return newAttention
  }

  const updateMedicalAttention = (id, updates) => {
    setMedicalAttentions(medicalAttentions.map(a => a.id === id ? { ...a, ...updates } : a))
  }

  const deleteMedicalAttention = (id) => {
    setMedicalAttentions(medicalAttentions.filter(a => a.id !== id))
  }

  const getMedicalAttentionById = (id) => medicalAttentions.find(a => a.id === id)

  const getMedicalAttentionsByPatient = (patientId) => 
    medicalAttentions.filter(a => a.patientId === patientId).sort((a, b) => new Date(b.date) - new Date(a.date))

  const getMedicalAttentionsByProfessional = (professionalId) => 
    medicalAttentions.filter(a => a.professionalId === professionalId).sort((a, b) => new Date(b.date) - new Date(a.date))

  const getMedicalAttentionsByDate = (date) =>
    medicalAttentions.filter(a => a.date === date)

  const value = {
    // Data
    patients,
    specialties,
    professionals,
    appointments,
    offices,
    medicalAttentions,
    
    // Patient functions
    addPatient,
    updatePatient,
    deletePatient,
    
    // Specialty functions
    addSpecialty,
    updateSpecialty,
    deleteSpecialty,
    
    // Professional functions
    addProfessional,
    updateProfessional,
    deleteProfessional,
    
    // Appointment functions
    addAppointment,
    updateAppointment,
    deleteAppointment,
    cancelAppointment,
    rescheduleAppointment,

    // Office functions
    addOffice,
    updateOffice,
    deleteOffice,
    getOfficeById,
    getAvailableOffices,

    // Medical Attention functions
    addMedicalAttention,
    updateMedicalAttention,
    deleteMedicalAttention,
    getMedicalAttentionById,
    getMedicalAttentionsByPatient,
    getMedicalAttentionsByProfessional,
    getMedicalAttentionsByDate,
    
    // Utility functions
    getPatientById,
    getProfessionalById,
    getSpecialtyById,
    getProfessionalsBySpecialty,
    getAppointmentsByDate,
    getAppointmentsByProfessional,
    getTodayAppointments,
    checkAvailability
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}