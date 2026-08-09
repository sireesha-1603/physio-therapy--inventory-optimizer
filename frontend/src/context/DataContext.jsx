import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const DataContext = createContext(null)
const roles = { administrator:'System Administrator', procurement_manager:'Procurement Manager', inventory_planner:'Inventory Planner', warehouse_user:'Warehouse User', supplier:'Supplier Partner', finance_reviewer:'Finance Reviewer' }
const itemView = item => ({ ...item, id:item._id, stock:item.currentStock, location:item.warehouse, leadTime:item.leadTimeDays || 0, lot:item.lot || '—', age:item.age || 0, expiry:item.expiry || 'N/A', status:item.status === 'critical' ? 'Critical Risk' : item.status === 'low' ? 'Low Stock' : 'Healthy' })
const recommendationView = record => ({ ...record, id:record._id, item:record.itemName, location:record.signals?.warehouse || '—', suggestedQty:record.signals?.suggestedQty || 0, window:record.signals?.window || 'Review', priority:record.confidence >= .9 ? 'High' : 'Medium', confidence:Math.round((record.confidence || 0) * 1000) / 10, status:record.status === 'pending' ? 'Pending Review' : record.status[0].toUpperCase()+record.status.slice(1) })
const auditView = log => ({ id:log._id, actor:log.actor?.name || 'System', role:roles[log.actor?.role] || 'System', action:log.action, entity:`${log.entityType || 'Record'} ${log.entityId || ''}`, reason:log.reason || '—', timestamp:new Date(log.createdAt).toLocaleString(), outcome:log.action.includes('OVERRIDE') ? 'Overridden' : 'Success' })
const notificationView = record => ({ ...record, id:record._id, read:Boolean(record.readAt), time:new Date(record.createdAt).toLocaleString(), category:record.category || 'Alerts' })
const userView = record => ({ ...record, id:record._id, roleName:roles[record.role] || record.role, status:record.active ? 'Active' : 'Deactivated', lastLogin:record.updatedAt ? new Date(record.updatedAt).toLocaleString() : 'Never' })
const supplierView = record => ({ ...record, id:record._id })
const orderView = record => ({ ...record, id:record._id, supplierName:record.supplier?.name || 'Unassigned', itemName:record.lines?.[0]?.item?.name || '—', quantity:record.lines?.[0]?.quantity || 0 })

export function DataProvider({ children }) {
  const { token } = useAuth()
  const [items, setItems] = useState([]); const [recommendations, setRecommendations] = useState([])
  const [suppliers, setSuppliers] = useState([]); const [notifications, setNotifications] = useState([])
  const [auditLogs, setAuditLogs] = useState([]); const [users, setUsers] = useState([]); const [purchaseOrders, setPurchaseOrders] = useState([])
  const [forecasts,setForecasts]=useState([]); const [outcomes,setOutcomes]=useState({rows:[],accuracy:0,adoption:0}); const [feedback,setFeedback]=useState([]); const [reports,setReports]=useState([]); const [settings,setSettings]=useState({safetyMultiplier:1.5,aiConfidenceThreshold:85})

  const refresh = async () => {
    if (!token) return
    const requests=['/inventory/items?limit=100','/ai/recommendations','/operations/suppliers','/operations/notifications','/operations/audit-logs','/operations/users','/operations/purchase-orders','/operations/forecasts','/operations/outcomes','/operations/feedback','/operations/reports','/operations/settings']
    const results=await Promise.all(requests.map(path=>api.get(path).then(response=>response.data.data).catch(()=>null)))
    const [itemsData,recsData,suppliersData,notificationsData,auditsData,usersData,ordersData,forecastsData,outcomesData,feedbackData,reportsData,settingsData]=results
    setItems((itemsData||[]).map(itemView)); setRecommendations((recsData||[]).map(recommendationView)); setSuppliers((suppliersData||[]).map(supplierView)); setNotifications((notificationsData||[]).map(notificationView)); setAuditLogs((auditsData||[]).map(auditView)); setUsers((usersData||[]).map(userView)); setPurchaseOrders((ordersData||[]).map(orderView)); setForecasts(forecastsData||[]); setOutcomes(outcomesData||{rows:[],accuracy:0,adoption:0}); setFeedback(feedbackData||[]); setReports(reportsData||[]); if(settingsData)setSettings(current=>({...current,...settingsData}))
  }
  useEffect(() => { if (!token) { setItems([]);setRecommendations([]);setSuppliers([]);setNotifications([]);setAuditLogs([]);setUsers([]);setPurchaseOrders([]); return } refresh().catch(() => {}) }, [token])

  const updateRecommendation = async (id, status, reason) => { const map={Approved:'approved',Rejected:'rejected',Overridden:'overridden',Deferred:'deferred'}; const response=await api.patch(`/ai/recommendations/${id}/decision`,{status:map[status],reason:reason || 'Planner decision'}); setRecommendations(current=>current.map(record=>record.id===id?recommendationView(response.data.data):record)); await refresh() }
  const generateRecommendations = async () => { const response=await api.post('/ai/recommendations/generate'); setRecommendations(current=>[...response.data.data.map(recommendationView),...current]); await refresh(); return response.data.data.length }
  const addItem = async item => { const response=await api.post('/inventory/items',{...item,currentStock:Number(item.stock||item.currentStock||0),warehouse:item.location||item.warehouse}); setItems(current=>[itemView(response.data.data),...current]); await refresh(); return itemView(response.data.data) }
  const updateItem = async (id, updates) => { const response=await api.patch(`/inventory/items/${id}`,{...updates,currentStock:updates.stock}); setItems(current=>current.map(item=>item.id===id?itemView(response.data.data):item)); await refresh() }
  const markNotificationRead = async id => { const response=await api.patch(`/operations/notifications/${id}/read`); setNotifications(current=>current.map(item=>item.id===id?notificationView(response.data.data):item)) }
  const clearNotifications = async () => { await api.delete('/operations/notifications'); setNotifications([]) }
  const addUser = async user => { const response=await api.post('/operations/users',{name:user.name,email:user.email,role:user.role,scope:user.scope}); setUsers(current=>[userView(response.data.data),...current]); await refresh() }
  const toggleUserStatus = async id => { const current=users.find(user=>user.id===id); const response=await api.patch(`/operations/users/${id}/active`,{active:current.status !== 'Active'}); setUsers(users=>users.map(user=>user.id===id?userView(response.data.data):user)); await refresh() }
  const createPurchaseOrder = async ({ supplierId, itemId, quantity }) => { const response=await api.post('/operations/purchase-orders',{supplierId,itemId,quantity:Number(quantity)}); const order=orderView(response.data.data); setPurchaseOrders(current=>[order,...current]); await refresh(); return order }
  const generateForecast=async category=>{const response=await api.post('/operations/forecasts/generate',{category});setForecasts(current=>[response.data.data,...current]);await refresh();return response.data.data}
  const addOutcomeFeedback=async(message,category)=>{const response=await api.post('/operations/feedback',{message,category});setFeedback(current=>[response.data.data,...current]);return response.data.data}
  const generateReport=async(format,range)=>{const response=await api.post('/operations/reports',{format,range});setReports(current=>[response.data.data,...current]);return response.data.data}
  const saveSettings=async values=>{const response=await api.put('/operations/settings',values);setSettings(response.data.data);await refresh()}

  return <DataContext.Provider value={{items,recommendations,suppliers,notifications,auditLogs,users,purchaseOrders,forecasts,outcomes,feedback,reports,settings,refresh,updateRecommendation,generateRecommendations,generateForecast,addOutcomeFeedback,generateReport,saveSettings,addItem,updateItem,markNotificationRead,clearNotifications,addUser,toggleUserStatus,createPurchaseOrder}}>{children}</DataContext.Provider>
}
export function useData(){const context=useContext(DataContext);if(!context)throw new Error('useData must be used within a DataProvider');return context}
