import axios from 'axios'

const api = axios.create({
  baseURL: 'https://physio-therapy-inventory-optimizer-final.onrender.com' || 'http://localhost:5000/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('physioflow_token') || sessionStorage.getItem('physioflow_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
