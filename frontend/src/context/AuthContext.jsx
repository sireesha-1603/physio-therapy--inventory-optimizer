import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const ROLES = {
  PROCUREMENT_MANAGER: { id: 'procurement_manager', name: 'Procurement Manager', scope: 'Enterprise' },
  INVENTORY_PLANNER: { id: 'inventory_planner', name: 'Inventory Planner', scope: 'All Clinics' },
  WAREHOUSE_USER: { id: 'warehouse_user', name: 'Warehouse User', scope: 'Central Hub' },
  SUPPLIER: { id: 'supplier', name: 'Supplier Partner', scope: 'Contracted Supplies' },
  FINANCE_REVIEWER: { id: 'finance_reviewer', name: 'Finance Reviewer', scope: 'Financial Approvals' },
  ADMINISTRATOR: { id: 'administrator', name: 'System Administrator', scope: 'Global Admin' }
}

const DEFAULT_USER = {
  id: 'usr_001',
  name: 'Arjun Sharma',
  email: 'arjun.sharma@physioflow.local',
  role: 'inventory_planner',
  roleName: 'Inventory Planner',
  scope: 'Koregaon Park & Bandra Clinics',
  avatar: 'AS',
  lastLogin: '2026-08-04 09:14 AM'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('physioflow_user')
    return saved ? JSON.parse(saved) : DEFAULT_USER
  })
  const [token, setToken] = useState(() => localStorage.getItem('physioflow_token') || 'mock_jwt_token_2026')
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const login = (email, password, roleKey = 'inventory_planner', remember = true) => {
    const roleObj = ROLES[roleKey.toUpperCase()] || ROLES.INVENTORY_PLANNER
    const loggedUser = {
      id: `usr_${Date.now().toString().slice(-4)}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role: roleObj.id,
      roleName: roleObj.name,
      scope: roleObj.scope,
      avatar: email.substring(0, 2).toUpperCase(),
      lastLogin: new Date().toLocaleString()
    }
    const mockToken = `jwt_${Date.now()}_${roleObj.id}`
    
    setUser(loggedUser)
    setToken(mockToken)
    setIsAuthenticated(true)

    if (remember) {
      localStorage.setItem('physioflow_user', JSON.stringify(loggedUser))
      localStorage.setItem('physioflow_token', mockToken)
    }
    return loggedUser
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem('physioflow_user')
    localStorage.removeItem('physioflow_token')
  }

  const switchRole = (roleId) => {
    const roleObj = Object.values(ROLES).find(r => r.id === roleId) || ROLES.INVENTORY_PLANNER
    const updatedUser = {
      ...user,
      role: roleObj.id,
      roleName: roleObj.name,
      scope: roleObj.scope
    }
    setUser(updatedUser)
    localStorage.setItem('physioflow_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, switchRole, ROLES }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
