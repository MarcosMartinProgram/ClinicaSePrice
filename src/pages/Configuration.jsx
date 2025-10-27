import React from 'react'

function Configuration() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuración del Sistema</h1>
        <p className="text-gray-600">
          Gestión de usuarios y configuraciones generales del sistema.
        </p>
        <div className="mt-6 p-4 bg-red-50 rounded-lg">
          <p className="text-red-800 text-sm">
            <strong>Configuraciones disponibles:</strong>
          </p>
          <ul className="text-red-700 text-sm mt-2 space-y-1">
            <li>• Gestión de usuarios</li>
            <li>• Roles y permisos</li>
            <li>• Logo de la clínica</li>
            <li>• Colores del sistema</li>
            <li>• Configuraciones generales</li>
            <li>• Backup y restauración</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Configuration