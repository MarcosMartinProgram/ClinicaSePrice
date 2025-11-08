import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Usuarios de ejemplo para testing
const mockUsers = [
  {
    id: 1,
    username: 'recepcion',
    password: '123456',
    role: 'recepcionista',
    name: 'María García',
    active: true
  },
  {
    id: 2,
    username: 'doctor',
    password: '123456',
    role: 'medico',
    name: 'Dr. Juan Pérez',
    professionalId: 1, // Asociado al Dr. Juan Carlos Pérez (id: 1 en professionals)
    active: true
  },
  {
    id: 3,
    username: 'admin',
    password: '123456',
    role: 'administrador',
    name: 'Carlos López',
    active: true
  }
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      // Simular API call
      const foundUser = mockUsers.find(
        u => u.username === username && u.password === password && u.active
      )
      
      if (!foundUser) {
        throw new Error('Credenciales inválidas')
      }

      const userSession = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        name: foundUser.name,
        professionalId: foundUser.professionalId // Incluir professionalId si existe
      }

      setUser(userSession)
      localStorage.setItem('currentUser', JSON.stringify(userSession))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const forgotPassword = async (username) => {
    // Simular envío de email
    const foundUser = mockUsers.find(u => u.username === username)
    if (foundUser) {
      console.log(`Email de recuperación enviado a ${username}`)
      return { success: true, message: 'Se ha enviado un email con las instrucciones para recuperar tu contraseña.' }
    } else {
      return { success: false, error: 'Usuario no encontrado.' }
    }
  }

  const value = {
    user,
    login,
    logout,
    forgotPassword,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}