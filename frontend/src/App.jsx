import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'

import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { ToastNotification } from './components/ToastNotification'
import { OverrideModal, ExportModal, ScenarioModal } from './components/Modals'

import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { InventoryDetailPage } from './pages/InventoryDetailPage'
import { PurchasePlanningPage } from './pages/PurchasePlanningPage'
import { ApprovalsOverridePage } from './pages/ApprovalsOverridePage'
import { DemandForecastingPage } from './pages/DemandForecastingPage'
import { ReorderRecommendationsPage } from './pages/ReorderRecommendationsPage'
import { InventoryOutcomesPage } from './pages/InventoryOutcomesPage'
import { ReportsAnalyticsPage } from './pages/ReportsAnalyticsPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { UserManagementPage } from './pages/UserManagementPage'
import { AuditSettingsPage } from './pages/AuditSettingsPage'

import './App.css'

function AppLayout({ children, addToast, onOpenOverride, onOpenExport, onOpenScenario }) {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()

  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  if (!isAuthenticated || location.pathname === '/login') {
    return <LoginPage addToast={addToast} />
  }

  // Page title mapping
  const pageTitles = {
    '/': { title: `Good morning, ${user?.name?.split(' ')[0]} 👋`, sub: 'Demand, Supply & Inventory Dashboard across 5 supply categories' },
    '/inventory': { title: 'Item, Lot & Stock Details', sub: 'Granular inventory status, lot tracking, age, expiry & safety stock' },
    '/purchases': { title: 'Replenishment & Purchase Planning', sub: 'Purchase workbench, supplier scorecards & scenario simulation' },
    '/approvals': { title: 'Planner Approval & Override Workbench', sub: 'Review AI recommendations with mandatory decision audit logging' },
    '/forecast': { title: 'Demand Forecasting & Safety Stock', sub: 'Predictive demand modeling, confidence scores & model inputs' },
    '/recommendations': { title: 'Reorder, Transfer & Supplier Recommendations', sub: 'AI automated suggestions vs approved business decisions' },
    '/accuracy': { title: 'Inventory Outcomes & Forecast Accuracy', sub: 'Model drift, prediction latency, adoption rate & actual outcomes' },
    '/reports': { title: 'Reports & Visual Analytics', sub: 'Comprehensive reporting suite with CSV and PDF export options' },
    '/notifications': { title: 'Notifications Center', sub: 'In-app alert panel, assignments & preference configuration' },
    '/users': { title: 'User & Role Access Management', sub: 'Least-privilege RBAC role management and access logs' },
    '/audit-settings': { title: 'Audit Logs & System Settings', sub: 'Searchable system security audit trail and master thresholds' }
  }

  const currentTitle = pageTitles[location.pathname] || { title: 'PhysioFlow Workspace', sub: 'Enterprise Operations' }

  return (
    <div className="app-shell">
      <Sidebar 
        onOpenHelp={() => setShowHelpModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      <div className="page">
        <Header 
          title={currentTitle.title}
          subtitle={currentTitle.sub}
          onOpenSearch={() => setShowSearchModal(true)}
          onOpenExport={() => onOpenExport(() => {})}
        />

        {children}
      </div>

      {/* Global Modals */}
      {showSearchModal && (
        <div className="modal-overlay" onClick={() => setShowSearchModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔍 Global Workspace Search</h3>
              <button className="close-btn" onClick={() => setShowSearchModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <input type="text" className="form-input" placeholder="Search items, POs, audit logs, clinic locations..." autoFocus />
              <div style={{ marginTop: '14px', fontSize: '12px', color: '#64748b' }}>
                Quick Links: Therapeutic Ultrasound Gel • Kinesiology Tape • Cold Pack Lot LOT-C2026
              </div>
            </div>
          </div>
        </div>
      )}

      {showHelpModal && (
        <div className="modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Help & Support Desk</h3>
              <button className="close-btn" onClick={() => setShowHelpModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '13px', color: '#64748b' }}>Contact operations support or access user manuals.</p>
              <button className="btn-primary" style={{ marginTop: '10px' }} onClick={() => { addToast('Support Ticket Issued', 'Ticket #9041 created', 'success'); setShowHelpModal(false); }}>
                Create Support Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Account Details</h3>
              <button className="close-btn" onClick={() => setShowProfileModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '18px' }}>{user?.avatar}</div>
                <div>
                  <strong style={{ fontSize: '16px' }}>{user?.name}</strong>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{user?.email}</p>
                  <span className="type reorder" style={{ fontSize: '10px', marginTop: '4px', display: 'inline-block' }}>{user?.roleName}</span>
                </div>
              </div>
              <button className="btn-outline" style={{ width: '100%', color: '#ef4444' }} onClick={() => { logout(); setShowProfileModal(false); }}>
                Sign Out of Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MainRoutes({ addToast, onOpenOverride, onOpenExport, onOpenScenario }) {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage addToast={addToast} />} />
      <Route path="/" element={<DashboardPage addToast={addToast} onOpenOverride={onOpenOverride} />} />
      <Route path="/inventory" element={<InventoryDetailPage addToast={addToast} />} />
      <Route path="/purchases" element={<PurchasePlanningPage addToast={addToast} onOpenScenario={onOpenScenario} />} />
      <Route path="/approvals" element={<ApprovalsOverridePage addToast={addToast} onOpenOverride={onOpenOverride} />} />
      <Route path="/forecast" element={<DemandForecastingPage addToast={addToast} />} />
      <Route path="/recommendations" element={<ReorderRecommendationsPage addToast={addToast} onOpenOverride={onOpenOverride} />} />
      <Route path="/accuracy" element={<InventoryOutcomesPage addToast={addToast} />} />
      <Route path="/reports" element={<ReportsAnalyticsPage addToast={addToast} onOpenExport={onOpenExport} />} />
      <Route path="/notifications" element={<NotificationsPage addToast={addToast} />} />
      <Route path="/users" element={<UserManagementPage addToast={addToast} />} />
      <Route path="/audit-settings" element={<AuditSettingsPage addToast={addToast} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  const [toasts, setToasts] = useState([])
  
  // Modal Trigger Handlers
  const [overrideModal, setOverrideModal] = useState({ open: false, callback: null })
  const [exportModal, setExportModal] = useState({ open: false, callback: null })
  const [scenarioModal, setScenarioModal] = useState({ open: false, callback: null })

  const addToast = (title, message = '', type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, title, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }

  const handleOpenOverride = (callback) => {
    setOverrideModal({ open: true, callback })
  }

  const handleOpenExport = (callback) => {
    setExportModal({ open: true, callback })
  }

  const handleOpenScenario = (callback) => {
    setScenarioModal({ open: true, callback })
  }

  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <AppLayout 
            addToast={addToast}
            onOpenOverride={handleOpenOverride}
            onOpenExport={handleOpenExport}
            onOpenScenario={handleOpenScenario}
          >
            <MainRoutes 
              addToast={addToast}
              onOpenOverride={handleOpenOverride}
              onOpenExport={handleOpenExport}
              onOpenScenario={handleOpenScenario}
            />
          </AppLayout>

          <ToastNotification toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />

          {/* Modal Overlays */}
          <OverrideModal 
            isOpen={overrideModal.open}
            onClose={() => setOverrideModal({ open: false, callback: null })}
            onSubmit={(data) => {
              if (overrideModal.callback) overrideModal.callback(data)
            }}
          />

          <ExportModal 
            isOpen={exportModal.open}
            onClose={() => setExportModal({ open: false, callback: null })}
            onExport={(format, range) => {
              if (exportModal.callback) exportModal.callback(format, range)
              addToast('Report Exported', `Generated ${format.toUpperCase()} for ${range}`, 'success')
            }}
          />

          <ScenarioModal 
            isOpen={scenarioModal.open}
            onClose={() => setScenarioModal({ open: false, callback: null })}
            onRunScenario={(params) => {
              if (scenarioModal.callback) scenarioModal.callback(params)
            }}
          />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  )
}
