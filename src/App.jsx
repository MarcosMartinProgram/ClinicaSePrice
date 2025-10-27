import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import Professionals from './pages/Professionals'
import Specialties from './pages/Specialties'
import Offices from './pages/Offices'
import Appointments from './pages/Appointments'
import MedicalAttentions from './pages/MedicalAttentions'
import WaitingRoom from './pages/WaitingRoom'
import Reports from './pages/Reports'
import Configuration from './pages/Configuration'
import Layout from './components/Layout'

// Componente para rutas protegidas
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  
  return children
}

// Componente para redireccionar según el rol del usuario
function RoleBasedRedirect() {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  switch (user.role) {
    case 'recepcionista':
      return <Navigate to="/dashboard" replace />
    case 'medico':
      return <Navigate to="/appointments" replace />
    case 'administrador':
      return <Navigate to="/dashboard" replace />
    default:
      return <Navigate to="/login" replace />
  }
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="App">
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RoleBasedRedirect />} />
            
            {/* Rutas protegidas con Layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['recepcionista', 'administrador']}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/patients" element={
              <ProtectedRoute allowedRoles={['recepcionista', 'administrador']}>
                <Layout>
                  <Patients />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/professionals" element={
              <ProtectedRoute allowedRoles={['recepcionista', 'administrador']}>
                <Layout>
                  <Professionals />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/specialties" element={
              <ProtectedRoute allowedRoles={['recepcionista', 'administrador']}>
                <Layout>
                  <Specialties />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/offices" element={
              <ProtectedRoute allowedRoles={['recepcionista', 'administrador']}>
                <Layout>
                  <Offices />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Layout>
                  <Appointments />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/medical-attentions" element={
              <ProtectedRoute allowedRoles={['medico', 'administrador']}>
                <Layout>
                  <MedicalAttentions />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/waiting-room" element={
              <ProtectedRoute allowedRoles={['recepcionista', 'medico', 'administrador']}>
                <Layout>
                  <WaitingRoom />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/configuration" element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <Layout>
                  <Configuration />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/unauthorized" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso No Autorizado</h1>
                  <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
                </div>
              </div>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  )
}

export default App