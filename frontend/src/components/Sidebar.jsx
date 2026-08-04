import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const NAVIGATION_ITEMS = [
  { label: 'Overview', icon: '⌂', path: '/' },
  { label: 'Inventory Details', icon: '▦', path: '/inventory' },
  { label: 'Purchase Planning', icon: '◫', path: '/purchases' },
  { label: 'Planner Approvals', icon: '✓', path: '/approvals', badge: '4' },
  { label: 'Demand Forecasting', icon: '⌁', path: '/forecast' },
  { label: 'Reorder & Transfers', icon: '✦', path: '/recommendations' },
  { label: 'Outcomes & Accuracy', icon: '◔', path: '/accuracy' },
  { label: 'Reports & Analytics', icon: '📊', path: '/reports' },
  { label: 'Notifications', icon: '♧', path: '/notifications', badge: '3' },
  { label: 'User & Role Mgmt', icon: '👥', path: '/users' },
  { label: 'Audit & Settings', icon: '⚙', path: '/audit-settings' }
]

export function Sidebar({ onOpenHelp, onOpenProfile }) {
  const { user } = useAuth()

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">+</span>
        <span>physio<span>flow</span></span>
      </div>
      <div className="workspace" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>OPERATIONS</span>
        <span className="role-pill" title="Active Scope">{user?.scope || 'Enterprise'}</span>
      </div>
      <nav style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
        {NAVIGATION_ITEMS.map(item => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <i>{item.icon}</i>
            <span>{item.label}</span>
            {item.badge && <b>{item.badge}</b>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="support" onClick={onOpenHelp}>
          <span>?</span> Help & Support
        </button>
        <div className="user" onClick={onOpenProfile}>
          <div className="avatar">{user?.avatar || 'AS'}</div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <strong>{user?.name || 'Arjun Sharma'}</strong>
            <small>{user?.roleName || 'Inventory Planner'}</small>
          </div>
          <span>⌄</span>
        </div>
      </div>
    </aside>
  )
}
