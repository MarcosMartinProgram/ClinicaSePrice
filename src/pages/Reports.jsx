import { useState, useMemo } from 'react'
import { useData } from '../context/DataContext'
import { 
  FileText, 
  Download, 
  Calendar, 
  Users, 
  UserCheck, 
  TrendingUp,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  Filter,
  RefreshCw
} from 'lucide-react'

function Reports() {
  const { 
    appointments, 
    patients, 
    professionals, 
    specialties,
    medicalAttentions,
    getPatientById,
    getProfessionalById,
    getSpecialtyById
  } = useData()

  const [selectedReport, setSelectedReport] = useState('general')
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0])
  const [selectedProfessional, setSelectedProfessional] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')

  // Filtrar datos por rango de fechas
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      const from = new Date(dateFrom)
      const to = new Date(dateTo)
      
      const inDateRange = aptDate >= from && aptDate <= to
      const matchesProfessional = !selectedProfessional || apt.professionalId === parseInt(selectedProfessional)
      const matchesSpecialty = !selectedSpecialty || apt.specialtyId === parseInt(selectedSpecialty)
      
      return inDateRange && matchesProfessional && matchesSpecialty
    })
  }, [appointments, dateFrom, dateTo, selectedProfessional, selectedSpecialty])

  // Estadísticas generales
  const generalStats = useMemo(() => {
    const totalAppointments = filteredAppointments.length
    const confirmedAppointments = filteredAppointments.filter(a => a.status === 'confirmado').length
    const attendedAppointments = filteredAppointments.filter(a => a.status === 'atendido').length
    const cancelledAppointments = filteredAppointments.filter(a => a.status === 'cancelado').length
    const absentAppointments = filteredAppointments.filter(a => a.status === 'ausente').length
    
    const attendanceRate = totalAppointments > 0 
      ? ((attendedAppointments / totalAppointments) * 100).toFixed(1)
      : 0
    
    const cancellationRate = totalAppointments > 0
      ? ((cancelledAppointments / totalAppointments) * 100).toFixed(1)
      : 0

    return {
      totalAppointments,
      confirmedAppointments,
      attendedAppointments,
      cancelledAppointments,
      absentAppointments,
      attendanceRate,
      cancellationRate,
      totalPatients: patients.filter(p => p.status === 'activo').length,
      totalProfessionals: professionals.filter(p => p.status === 'activo').length,
      totalAttentions: medicalAttentions.length
    }
  }, [filteredAppointments, patients, professionals, medicalAttentions])

  // Turnos por especialidad
  const appointmentsBySpecialty = useMemo(() => {
    const grouped = {}
    filteredAppointments.forEach(apt => {
      const specialty = getSpecialtyById(apt.specialtyId)
      if (specialty) {
        if (!grouped[specialty.name]) {
          grouped[specialty.name] = {
            total: 0,
            attended: 0,
            cancelled: 0,
            pending: 0
          }
        }
        grouped[specialty.name].total++
        if (apt.status === 'atendido') grouped[specialty.name].attended++
        if (apt.status === 'cancelado') grouped[specialty.name].cancelled++
        if (apt.status === 'confirmado') grouped[specialty.name].pending++
      }
    })
    return Object.entries(grouped).map(([name, stats]) => ({ name, ...stats }))
  }, [filteredAppointments, getSpecialtyById])

  // Turnos por profesional
  const appointmentsByProfessional = useMemo(() => {
    const grouped = {}
    filteredAppointments.forEach(apt => {
      const professional = getProfessionalById(apt.professionalId)
      if (professional) {
        if (!grouped[professional.fullName]) {
          grouped[professional.fullName] = {
            total: 0,
            attended: 0,
            cancelled: 0,
            pending: 0,
            specialty: getSpecialtyById(professional.specialtyId)?.name || 'N/A'
          }
        }
        grouped[professional.fullName].total++
        if (apt.status === 'atendido') grouped[professional.fullName].attended++
        if (apt.status === 'cancelado') grouped[professional.fullName].cancelled++
        if (apt.status === 'confirmado') grouped[professional.fullName].pending++
      }
    })
    return Object.entries(grouped)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.total - a.total)
  }, [filteredAppointments, getProfessionalById, getSpecialtyById])

  // Pacientes más frecuentes
  const topPatients = useMemo(() => {
    const grouped = {}
    filteredAppointments.forEach(apt => {
      const patient = getPatientById(apt.patientId)
      if (patient) {
        const key = `${patient.firstName} ${patient.lastName}`
        if (!grouped[key]) {
          grouped[key] = {
            name: key,
            dni: patient.dni,
            insurance: patient.insurance,
            appointments: 0,
            attended: 0
          }
        }
        grouped[key].appointments++
        if (apt.status === 'atendido') grouped[key].attended++
      }
    })
    return Object.values(grouped)
      .sort((a, b) => b.appointments - a.appointments)
      .slice(0, 10)
  }, [filteredAppointments, getPatientById])

  // Distribución por tipo de turno
  const appointmentsByType = useMemo(() => {
    const types = {
      regular: 0,
      urgencia: 0,
      control: 0
    }
    filteredAppointments.forEach(apt => {
      if (types.hasOwnProperty(apt.type)) {
        types[apt.type]++
      }
    })
    return Object.entries(types).map(([type, count]) => ({ type, count }))
  }, [filteredAppointments])

  // Exportar a CSV
  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).join(',')).join('\n')
    const csv = `${headers}\n${rows}`
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Resetear filtros
  const resetFilters = () => {
    setDateFrom(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0])
    setDateTo(new Date().toISOString().split('T')[0])
    setSelectedProfessional('')
    setSelectedSpecialty('')
  }

  const reportTypes = [
    { id: 'general', name: 'Estadísticas Generales', icon: Activity },
    { id: 'specialty', name: 'Por Especialidad', icon: BarChart3 },
    { id: 'professional', name: 'Por Profesional', icon: UserCheck },
    { id: 'patients', name: 'Pacientes Frecuentes', icon: Users },
    { id: 'types', name: 'Tipos de Turnos', icon: PieChart }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes del Sistema</h1>
            <p className="text-gray-600 mt-1">Análisis y estadísticas de la clínica</p>
          </div>
          <FileText className="w-10 h-10 text-primary-600" />
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </h2>
          <button
            onClick={resetFilters}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Resetear
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Desde
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profesional
            </label>
            <select
              value={selectedProfessional}
              onChange={(e) => setSelectedProfessional(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              {professionals.filter(p => p.status === 'activo').map(prof => (
                <option key={prof.id} value={prof.id}>{prof.fullName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialidad
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todas</option>
              {specialties.map(spec => (
                <option key={spec.id} value={spec.id}>{spec.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tarjetas de Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Turnos</p>
              <p className="text-2xl font-bold text-gray-900">{generalStats.totalAppointments}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasa Asistencia</p>
              <p className="text-2xl font-bold text-green-600">{generalStats.attendanceRate}%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelaciones</p>
              <p className="text-2xl font-bold text-red-600">{generalStats.cancelledAppointments}</p>
            </div>
            <Clock className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pacientes Activos</p>
              <p className="text-2xl font-bold text-purple-600">{generalStats.totalPatients}</p>
            </div>
            <Users className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Selector de Tipo de Reporte */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2 overflow-x-auto">
          {reportTypes.map(report => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedReport === report.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <report.icon className="w-4 h-4 mr-2" />
              {report.name}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del Reporte */}
      <div className="bg-white rounded-lg shadow">
        {/* Estadísticas Generales */}
        {selectedReport === 'general' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Estadísticas Generales</h2>
              <button
                onClick={() => exportToCSV([generalStats], 'estadisticas_generales')}
                className="btn-secondary text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Turnos por Estado</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Confirmados:</span>
                    <span className="font-semibold text-blue-600">{generalStats.confirmedAppointments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Atendidos:</span>
                    <span className="font-semibold text-green-600">{generalStats.attendedAppointments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Cancelados:</span>
                    <span className="font-semibold text-red-600">{generalStats.cancelledAppointments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Ausentes:</span>
                    <span className="font-semibold text-orange-600">{generalStats.absentAppointments}</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Tasas</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Asistencia:</span>
                    <span className="font-semibold text-green-600">{generalStats.attendanceRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Cancelación:</span>
                    <span className="font-semibold text-red-600">{generalStats.cancellationRate}%</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Recursos</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Pacientes Activos:</span>
                    <span className="font-semibold text-purple-600">{generalStats.totalPatients}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Profesionales Activos:</span>
                    <span className="font-semibold text-indigo-600">{generalStats.totalProfessionals}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Atenciones Médicas:</span>
                    <span className="font-semibold text-teal-600">{generalStats.totalAttentions}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reportes por Especialidad */}
        {selectedReport === 'specialty' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Turnos por Especialidad</h2>
              <button
                onClick={() => exportToCSV(appointmentsBySpecialty, 'turnos_por_especialidad')}
                className="btn-secondary text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Especialidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Atendidos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Pendientes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cancelados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tasa Atención
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointmentsBySpecialty.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {item.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600">
                        {item.attended}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-600">
                        {item.pending}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-red-600">
                        {item.cancelled}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {item.total > 0 ? ((item.attended / item.total) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {appointmentsBySpecialty.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No hay datos para mostrar con los filtros seleccionados
              </p>
            )}
          </div>
        )}

        {/* Reportes por Profesional */}
        {selectedReport === 'professional' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Turnos por Profesional</h2>
              <button
                onClick={() => exportToCSV(appointmentsByProfessional, 'turnos_por_profesional')}
                className="btn-secondary text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Profesional
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Especialidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Atendidos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Pendientes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cancelados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tasa Atención
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointmentsByProfessional.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {item.specialty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {item.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600">
                        {item.attended}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-600">
                        {item.pending}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-red-600">
                        {item.cancelled}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {item.total > 0 ? ((item.attended / item.total) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {appointmentsByProfessional.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No hay datos para mostrar con los filtros seleccionados
              </p>
            )}
          </div>
        )}

        {/* Pacientes Frecuentes */}
        {selectedReport === 'patients' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Pacientes Más Frecuentes</h2>
              <button
                onClick={() => exportToCSV(topPatients, 'pacientes_frecuentes')}
                className="btn-secondary text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      DNI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Obra Social
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Turnos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Atendidos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tasa Asistencia
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topPatients.map((patient, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {patient.dni}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {patient.insurance || 'Sin cobertura'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {patient.appointments}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600">
                        {patient.attended}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {patient.appointments > 0 
                          ? ((patient.attended / patient.appointments) * 100).toFixed(1) 
                          : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {topPatients.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No hay datos para mostrar con los filtros seleccionados
              </p>
            )}
          </div>
        )}

        {/* Tipos de Turnos */}
        {selectedReport === 'types' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Distribución por Tipo de Turno</h2>
              <button
                onClick={() => exportToCSV(appointmentsByType, 'tipos_de_turnos')}
                className="btn-secondary text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {appointmentsByType.map(({ type, count }) => {
                const percentage = filteredAppointments.length > 0 
                  ? ((count / filteredAppointments.length) * 100).toFixed(1)
                  : 0

                const colors = {
                  regular: 'bg-blue-100 text-blue-800 border-blue-300',
                  urgencia: 'bg-red-100 text-red-800 border-red-300',
                  control: 'bg-green-100 text-green-800 border-green-300'
                }

                const labels = {
                  regular: 'Turnos Regular',
                  urgencia: 'Urgencias',
                  control: 'Controles'
                }

                return (
                  <div key={type} className={`border-2 rounded-lg p-6 ${colors[type]}`}>
                    <h3 className="text-lg font-semibold mb-2">{labels[type]}</h3>
                    <p className="text-4xl font-bold mb-1">{count}</p>
                    <p className="text-sm">{percentage}% del total</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Total de turnos en el período:</strong> {filteredAppointments.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports