import { createContext, useContext, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)
export const ROLES = {
  PROCUREMENT_MANAGER:{id:'procurement_manager',name:'Procurement Manager',scope:'Enterprise'}, INVENTORY_PLANNER:{id:'inventory_planner',name:'Inventory Planner',scope:'All Clinics'}, WAREHOUSE_USER:{id:'warehouse_user',name:'Warehouse User',scope:'Central Hub'}, SUPPLIER:{id:'supplier',name:'Supplier Partner',scope:'Contracted Supplies'}, FINANCE_REVIEWER:{id:'finance_reviewer',name:'Finance Reviewer',scope:'Financial Approvals'}, ADMINISTRATOR:{id:'administrator',name:'System Administrator',scope:'Global Admin'}
}
const storage = () => localStorage.getItem('physioflow_token') ? localStorage : sessionStorage
const savedUser=()=>{try{return JSON.parse(storage().getItem('physioflow_user')||'null')}catch{return null}}
export function AuthProvider({children}) {
  const [user,setUser]=useState(savedUser)
  const [token,setToken]=useState(()=>storage().getItem('physioflow_token'))
  const [isAuthenticated,setIsAuthenticated]=useState(()=>Boolean(storage().getItem('physioflow_token') && savedUser()))
  const login=async(email,password,remember=true)=>{
    const response=await api.post('/auth/login',{email,password})
    const {token:jwt,user:apiUser}=response.data.data
    const role=Object.values(ROLES).find(value=>value.id===apiUser.role)
    const userData={...apiUser,roleName:role?.name||apiUser.role,scope:role?.scope||'Assigned scope',avatar:apiUser.name.split(' ').map(part=>part[0]).join('').slice(0,2).toUpperCase()}
    const targetStorage=remember ? localStorage : sessionStorage
    const otherStorage=remember ? sessionStorage : localStorage
    otherStorage.removeItem('physioflow_token'); otherStorage.removeItem('physioflow_user')
    targetStorage.setItem('physioflow_token',jwt); targetStorage.setItem('physioflow_user',JSON.stringify(userData))
    setToken(jwt); setUser(userData); setIsAuthenticated(true)
    return userData
  }
  const switchRole=(roleId)=>{
    const role=Object.values(ROLES).find(value=>value.id===roleId)
    if(!role || !user) return
    const userData={...user,role:role.id,roleName:role.name,scope:role.scope}
    storage().setItem('physioflow_user',JSON.stringify(userData)); setUser(userData)
  }
  const logout=()=>{setUser(null);setToken(null);setIsAuthenticated(false);[localStorage,sessionStorage].forEach(item=>{item.removeItem('physioflow_user');item.removeItem('physioflow_token')})}
  return <AuthContext.Provider value={{user,token,isAuthenticated,login,logout,switchRole,ROLES}}>{children}</AuthContext.Provider>
}
export function useAuth(){const context=useContext(AuthContext);if(!context)throw new Error('useAuth must be used within an AuthProvider');return context}
