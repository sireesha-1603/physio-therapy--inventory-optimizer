import { createContext, useContext, useState } from 'react'

const DataContext = createContext(null)

// Initial 5 Categories Items with Lot & Expiry details
const INITIAL_ITEMS = [
  { id: 'ITM-101', name: 'Kinesiology Tape (5m Roll)', category: 'Tapes', location: 'Koregaon Park', stock: 14, safetyStock: 40, leadTime: 4, lot: 'LOT-K2026-08', age: 14, expiry: '2027-11-30', unitCost: 350, reserved: 4, openOrders: 50, forecast: 65, status: 'Low Stock', priority: 'High' },
  { id: 'ITM-102', name: 'Therapeutic Ultrasound Gel 5L', category: 'Consumables', location: 'Koregaon Park', stock: 2, safetyStock: 15, leadTime: 7, lot: 'LOT-G2026-04', age: 45, expiry: '2026-08-22', unitCost: 1200, reserved: 1, openOrders: 20, forecast: 30, status: 'Critical Risk', priority: 'High' },
  { id: 'ITM-103', name: 'Hinge Knee Brace (Medium)', category: 'Braces', location: 'Bandra', stock: 28, safetyStock: 10, leadTime: 10, lot: 'LOT-B2026-01', age: 60, expiry: '2029-01-15', unitCost: 4500, reserved: 3, openOrders: 0, forecast: 12, status: 'Healthy', priority: 'Low' },
  { id: 'ITM-104', name: 'Resistance Bands Set (5 Level)', category: 'Therapy Accessories', location: 'Whitefield', stock: 45, safetyStock: 20, leadTime: 5, lot: 'LOT-R2026-03', age: 25, expiry: 'N/A', unitCost: 850, reserved: 8, openOrders: 0, forecast: 35, status: 'Healthy', priority: 'Low' },
  { id: 'ITM-105', name: 'Surface Disinfectant Wipes (100pk)', category: 'Hygiene Supplies', location: 'Indiranagar', stock: 8, safetyStock: 25, leadTime: 3, lot: 'LOT-H2026-09', age: 80, expiry: '2026-09-10', unitCost: 280, reserved: 2, openOrders: 100, forecast: 85, status: 'Expiring Soon', priority: 'Medium' },
  { id: 'ITM-106', name: 'Cold Pack Reusable (Large)', category: 'Consumables', location: 'Andheri', stock: 12, safetyStock: 30, leadTime: 6, lot: 'LOT-C2026-02', age: 92, expiry: '2026-08-28', unitCost: 420, reserved: 5, openOrders: 40, forecast: 50, status: 'Expiring Soon', priority: 'Medium' },
  { id: 'ITM-107', name: 'Cervical Traction Collar', category: 'Therapy Accessories', location: 'Koregaon Park', stock: 18, safetyStock: 8, leadTime: 12, lot: 'LOT-T2026-05', age: 30, expiry: '2030-05-01', unitCost: 3200, reserved: 0, openOrders: 0, forecast: 8, status: 'Healthy', priority: 'Low' },
  { id: 'ITM-108', name: 'Dry Needling Electrodes (100pk)', category: 'Consumables', location: 'Bandra', stock: 65, safetyStock: 20, leadTime: 5, lot: 'LOT-E2026-11', age: 10, expiry: '2028-06-15', unitCost: 650, reserved: 10, openOrders: 0, forecast: 40, status: 'Healthy', priority: 'Low' }
]

// AI Recommendations
const INITIAL_RECOMMENDATIONS = [
  { id: 'REC-001', type: 'Reorder', item: 'Therapeutic Ultrasound Gel 5L', location: 'Koregaon Park', suggestedQty: 25, window: '14 days', priority: 'High', confidence: 96.4, explanation: 'Current stock (2 units) will deplete in 3 days due to 34% increase in ultrasound therapy sessions.', status: 'Pending Review', supplier: 'MedTech Supplies' },
  { id: 'REC-002', type: 'Stock Transfer', item: 'Resistance Bands Set', location: 'Whitefield → Bandra', suggestedQty: 15, window: '3 days', priority: 'Medium', confidence: 91.8, explanation: 'Whitefield holds 45 units (excess), while Bandra demand surge requires 12 additional units.', status: 'Pending Review', supplier: 'Internal Transfer' },
  { id: 'REC-003', type: 'Review Expiry', item: 'Cold Pack Reusable (Large)', location: 'Andheri', suggestedQty: 10, window: '21 days', priority: 'Medium', confidence: 88.5, explanation: 'Batch LOT-C2026-02 expires Aug 28. Apply 15% clearance or transfer to high-demand rehab center.', status: 'Pending Review', supplier: 'Clearance Action' },
  { id: 'REC-004', type: 'Reorder', item: 'Surface Disinfectant Wipes', location: 'Indiranagar', suggestedQty: 100, window: '7 days', priority: 'High', confidence: 94.0, explanation: 'Stock level (8 units) below safety threshold (25 units) with lead time of 3 days.', status: 'Approved', supplier: 'CleanHygiene Corp' }
]

// Supplier Scorecards
const INITIAL_SUPPLIERS = [
  { id: 'SUP-01', name: 'PhysioEquipment Corp', category: 'Therapy Accessories & Braces', onTimeRate: 98.2, qualityScore: 99.1, costIndex: 'Optimal', status: 'Preferred' },
  { id: 'SUP-02', name: 'MedTech Supplies', category: 'Consumables & Gel', onTimeRate: 92.5, qualityScore: 96.8, costIndex: 'Standard', status: 'Active' },
  { id: 'SUP-03', name: 'CleanHygiene Corp', category: 'Hygiene Supplies', onTimeRate: 99.0, qualityScore: 98.5, costIndex: 'Low Cost', status: 'Preferred' },
  { id: 'SUP-04', name: 'KinesioTape Global', category: 'Tapes & Bandages', onTimeRate: 88.0, qualityScore: 94.2, costIndex: 'Premium', status: 'Under Review' }
]

// Notifications
const INITIAL_NOTIFICATIONS = [
  { id: 'NTF-1', title: 'Critical Stockout Alert', message: 'Ultrasound Gel 5L stock at 2 units (Koregaon Park).', time: '10m ago', category: 'Urgent', read: false, link: '/inventory' },
  { id: 'NTF-2', title: 'AI Recommendation Ready', message: '4 new reorder recommendations available for review.', time: '45m ago', category: 'AI Results', read: false, link: '/recommendations' },
  { id: 'NTF-3', title: 'Purchase Order Approved', message: 'PO-8812 approved by Finance Reviewer (₹2.1L).', time: '2h ago', category: 'Approvals', read: true, link: '/purchases' },
  { id: 'NTF-4', title: 'Expiry Warning', message: 'Cold Pack batch LOT-C2026-02 expires in 24 days.', time: '5h ago', category: 'Alerts', read: false, link: '/inventory' }
]

// Audit Logs
const INITIAL_AUDIT_LOGS = [
  { id: 'AUD-901', actor: 'Arjun Sharma', role: 'Inventory Planner', action: 'APPROVE_REC', entity: 'REC-004 (Disinfectant Wipes)', timestamp: '2026-08-04 14:30:12', reason: 'Approved reorder as recommended by AI', prevVal: 'Pending Review', newVal: 'Approved', outcome: 'Success' },
  { id: 'AUD-902', actor: 'Priya Mehta', role: 'Procurement Manager', action: 'OVERRIDE_QTY', entity: 'PO-8812 (PhysioEquipment)', timestamp: '2026-08-04 12:15:45', reason: 'Adjusted Qty from 20 to 30 due to supplier MOQ discount', prevVal: 'Qty: 20', newVal: 'Qty: 30', outcome: 'Overridden' },
  { id: 'AUD-903', actor: 'System AI', role: 'AI Model v2.4', action: 'RUN_FORECAST', entity: 'Category: Tapes', timestamp: '2026-08-04 08:00:00', reason: 'Scheduled daily demand forecast execution', prevVal: 'Accuracy 91.2%', newVal: 'Accuracy 94.2%', outcome: 'Completed' }
]

// Users
const INITIAL_USERS = [
  { id: 'usr_001', name: 'Arjun Sharma', email: 'arjun.sharma@physioflow.local', role: 'inventory_planner', roleName: 'Inventory Planner', scope: 'All Clinics', status: 'Active', lastLogin: '2026-08-04 09:14 AM' },
  { id: 'usr_002', name: 'Priya Mehta', email: 'priya.m@physioflow.local', role: 'procurement_manager', roleName: 'Procurement Manager', scope: 'Enterprise', status: 'Active', lastLogin: '2026-08-04 11:30 AM' },
  { id: 'usr_003', name: 'Rajesh Kumar', email: 'rajesh.k@physioflow.local', role: 'warehouse_user', roleName: 'Warehouse User', scope: 'Central Hub', status: 'Active', lastLogin: '2026-08-03 04:20 PM' },
  { id: 'usr_004', name: 'Sanjay Verma', email: 'sanjay.v@medtech.com', role: 'supplier', roleName: 'Supplier Partner', scope: 'MedTech Vendor', status: 'Active', lastLogin: '2026-08-02 10:00 AM' },
  { id: 'usr_005', name: 'Anita Desai', email: 'anita.d@physioflow.local', role: 'finance_reviewer', roleName: 'Finance Reviewer', scope: 'Finance Dept', status: 'Active', lastLogin: '2026-08-04 01:45 PM' },
  { id: 'usr_006', name: 'Vikram Sethi', email: 'admin@physioflow.local', role: 'administrator', roleName: 'System Administrator', scope: 'Global', status: 'Active', lastLogin: '2026-08-04 08:00 AM' }
]

export function DataProvider({ children }) {
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [recommendations, setRecommendations] = useState(INITIAL_RECOMMENDATIONS)
  const [suppliers] = useState(INITIAL_SUPPLIERS)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS)
  const [users, setUsers] = useState(INITIAL_USERS)

  // Audit Logging helper
  const addAuditLog = (actor, role, action, entity, reason, prevVal, newVal, outcome = 'Success') => {
    const newLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      actor,
      role,
      action,
      entity,
      timestamp: new Date().toLocaleString(),
      reason,
      prevVal: String(prevVal),
      newVal: String(newVal),
      outcome
    }
    setAuditLogs(prev => [newLog, ...prev])
  }

  // Update Recommendation Status with mandatory override logging
  const updateRecommendation = (recId, newStatus, reason = '', actor = 'User', role = 'Planner') => {
    let target = null
    setRecommendations(prev => prev.map(r => {
      if (r.id === recId) {
        target = r
        return { ...r, status: newStatus }
      }
      return r
    }))

    if (target) {
      addAuditLog(actor, role, `UPDATE_REC_${newStatus.toUpperCase()}`, `${target.id} (${target.item})`, reason || `Status changed to ${newStatus}`, target.status, newStatus)
    }
  }

  // Add Item
  const addItem = (itemData, actor = 'User', role = 'Planner') => {
    const newItem = {
      id: `ITM-${Date.now().toString().slice(-3)}`,
      ...itemData,
      status: 'Healthy'
    }
    setItems(prev => [newItem, ...prev])
    addAuditLog(actor, role, 'CREATE_ITEM', `${newItem.id} (${newItem.name})`, 'Created new inventory item record', 'N/A', `Stock: ${newItem.stock}`)
    return newItem
  }

  // Update Item
  const updateItem = (id, updates, actor = 'User', role = 'Planner') => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))
    addAuditLog(actor, role, 'UPDATE_ITEM', id, 'Updated stock/master data', 'Previous Data', JSON.stringify(updates))
  }

  // Mark notification read
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  // Add User
  const addUser = (userData, actor = 'Admin', role = 'Admin') => {
    const newUser = {
      id: `usr_${Date.now().toString().slice(-4)}`,
      ...userData,
      status: 'Active',
      lastLogin: 'Never'
    }
    setUsers(prev => [newUser, ...prev])
    addAuditLog(actor, role, 'CREATE_USER', `${newUser.name} (${newUser.email})`, 'Created user account', 'N/A', `Role: ${newUser.roleName}`)
  }

  // Toggle User Status
  const toggleUserStatus = (id, actor = 'Admin', role = 'Admin') => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Deactivated' : 'Active'
        addAuditLog(actor, role, 'TOGGLE_USER_STATUS', u.name, 'Changed account access status', u.status, nextStatus)
        return { ...u, status: nextStatus }
      }
      return u
    }))
  }

  return (
    <DataContext.Provider value={{
      items,
      recommendations,
      suppliers,
      notifications,
      auditLogs,
      users,
      addAuditLog,
      updateRecommendation,
      addItem,
      updateItem,
      markNotificationRead,
      clearNotifications,
      addUser,
      toggleUserStatus
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within a DataProvider')
  return context
}
