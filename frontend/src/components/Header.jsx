import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export function Header({ title, subtitle, eyebrow = 'TUESDAY, 4 AUGUST 2026', onOpenSearch, onOpenExport }) {
  const { user, switchRole, ROLES } = useAuth()
  const { notifications, markNotificationRead, clearNotifications } = useData()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showRoleMenu, setShowRoleMenu] = useState(false)
  const navigate = useNavigate()

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="main-header">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <p className="eyebrow">{eyebrow}</p>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>•</span>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
            Scope: {user?.scope}
          </span>
        </div>
        <h1>{title}</h1>
        {subtitle && <p className="sub">{subtitle}</p>}
      </div>

      <div className="header-actions">
        {/* Role Switcher Pill */}
        <div style={{ position: 'relative' }}>
          <button className="select" onClick={() => setShowRoleMenu(!showRoleMenu)} style={{ background: '#f1f5f9', borderColor: '#cbd5e1' }}>
            🎭 Role: <strong>{user?.roleName}</strong> ⌄
          </button>
          {showRoleMenu && (
            <div className="dropdown-menu" style={{ width: '220px', right: 0 }}>
              <div style={{ padding: '6px 12px', fontSize: '10px', fontWeight: 'bold', color: '#94a3b8' }}>
                SWITCH ACTIVE ROLE (RBAC)
              </div>
              {Object.values(ROLES).map(r => (
                <button 
                  key={r.id} 
                  className={`dropdown-item ${user?.role === r.id ? 'active' : ''}`}
                  onClick={() => { switchRole(r.id); setShowRoleMenu(false); }}
                >
                  <span style={{ fontWeight: user?.role === r.id ? 'bold' : 'normal' }}>{r.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search */}
        <button className="icon-btn" title="Global Search" onClick={onOpenSearch}>⌕</button>

        {/* Notifications Panel Dropdown */}
        <div style={{ position: 'relative' }}>
          <button className="bell" title="Notifications" onClick={() => setShowNotifications(!showNotifications)}>
            ♧{unreadCount > 0 && <b>{unreadCount}</b>}
          </button>

          {showNotifications && (
            <div className="dropdown-menu notifications-panel">
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '13px' }}>In-App Notifications</strong>
                <Link to="/notifications" onClick={() => setShowNotifications(false)} style={{ fontSize: '11px', color: '#5270df' }}>View all</Link>
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '14px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>No notifications</div>
              ) : (
                notifications.slice(0, 4).map(n => (
                  <div 
                    key={n.id} 
                    className={`notification-item ${n.read ? 'read' : 'unread'}`}
                    onClick={() => { markNotificationRead(n.id); navigate(n.link || '/'); setShowNotifications(false); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '12px' }}>{n.title}</strong>
                      <span className={`tag ${n.category.toLowerCase()}`}>{n.category}</span>
                    </div>
                    <small>{n.message}</small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Export Report */}
        <button className="btn-outline" onClick={onOpenExport}>
          ⇩ Export
        </button>
      </div>
    </header>
  )
}
