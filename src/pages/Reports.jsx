import React from 'react'

function Reports() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Reportes del Sistema</h1>
        <p className="text-gray-600">
          Generación de reportes y estadísticas de la clínica.
        </p>
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <p className="text-indigo-800 text-sm">
            <strong>Reportes disponibles:</strong>
          </p>
          <ul className="text-indigo-700 text-sm mt-2 space-y-1">
            <li>• Turnos por especialidad</li>
            <li>• Turnos por médico</li>
            <li>• Pacientes ausentes</li>
            <li>• Sobreturnos generados</li>
            <li>• Horas de atención por médico</li>
            <li>• Exportar a PDF/Excel</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Reports