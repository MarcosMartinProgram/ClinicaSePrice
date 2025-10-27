import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User } from 'lucide-react'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('')

  const { login, forgotPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validaciones básicas
    if (!username || !password) {
      setError('Por favor, complete todos los campos.')
      setLoading(false)
      return
    }

    try {
      const result = await login(username, password)
      
      if (result.success) {
        // La redirección se maneja automáticamente por el RoleBasedRedirect en App.jsx
        navigate('/')
      } else {
        setError(result.error || 'Error al iniciar sesión')
      }
    } catch (err) {
      setError('Error de conexión. Intente nuevamente.')
    }
    
    setLoading(false)
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!username) {
      setError('Por favor, ingrese su nombre de usuario.')
      return
    }

    const result = await forgotPassword(username)
    if (result.success) {
      setForgotPasswordMessage(result.message)
      setShowForgotPassword(false)
      setError('')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo y título */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m0 0h4M7 7h10M7 11h10M7 15h7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">SePrice</h2>
            <p className="mt-2 text-sm text-gray-600">Clínica Médica</p>
            <p className="text-xs text-gray-500">Sistema de Gestión</p>
          </div>

          {/* Mensajes de éxito */}
          {forgotPasswordMessage && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
              {forgotPasswordMessage}
            </div>
          )}

          {/* Formulario de login */}
          {!showForgotPassword ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Usuario
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      className="input-field pl-10"
                      placeholder="Ingrese su usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className="input-field pl-10 pr-10"
                      placeholder="Ingrese su contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-500"
                  onClick={() => setShowForgotPassword(true)}
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>
            </form>
          ) : (
            /* Formulario de recuperación de contraseña */
            <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
              <div>
                <h3 className="text-lg font-medium text-gray-900 text-center">
                  Recuperar Contraseña
                </h3>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Ingrese su nombre de usuario para recibir instrucciones de recuperación.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="forgot-username" className="block text-sm font-medium text-gray-700">
                  Usuario
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="forgot-username"
                    name="username"
                    type="text"
                    required
                    className="input-field pl-10"
                    placeholder="Ingrese su usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Enviar
                </button>
                <button
                  type="button"
                  className="btn-secondary flex-1"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setError('')
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Información de usuarios de prueba */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Usuarios de prueba:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Recepcionista:</strong> recepcion / 123456</div>
              <div><strong>Médico:</strong> doctor / 123456</div>
              <div><strong>Administrador:</strong> admin / 123456</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login