import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'

export function NotificationsPage({ addToast }) {
  const { notifications, markNotificationRead, clearNotifications } = useData()
  const [filterCategory, setFilterCategory] = useState('All')
  const navigate = useNavigate()

  const filtered = notifications.filter(n => filterCategory === 'All' || n.category === filterCategory)

  return (
    <div>
      <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Urgent', 'AI Results', 'Approvals', 'Alerts'].map(cat => (
            <button 
              key={cat} 
              className={`btn-outline ${filterCategory === cat ? 'active-tab' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-outline" onClick={async () => { try { await clearNotifications(); addToast('Notifications Cleared', '', 'info') } catch { addToast('Unable to clear notifications', 'Please try again.', 'error') } }}>
            Clear All
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h2>In-App System & Action Notifications</h2>
            <p>Track assignments, exceptions, alerts, approvals, and AI execution results</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div>♧</div>
            <h2>No Notifications</h2>
            <p>You have caught up with all assignments and alerts.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(n => (
              <div 
                key={n.id} 
                className={`alert ${n.read ? '' : 'unread-panel-item'}`}
                style={{ background: n.read ? '#fff' : '#f0fdf4', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              >
                <i className={n.category === 'Urgent' ? 'red' : 'blue'}>
                  {n.category === 'Urgent' ? '!' : '♧'}
                </i>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <strong>{n.title}</strong>
                    <span className="type reorder" style={{ fontSize: '9px' }}>{n.category}</span>
                    {!n.read && <span style={{ background: '#22c55e', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '9px' }}>NEW</span>}
                  </div>
                  <small style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                    {n.message} • <span style={{ color: '#94a3b8' }}>{n.time}</span>
                  </small>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {!n.read && (
                    <button className="btn-outline" style={{ fontSize: '10px', padding: '4px 8px' }} onClick={() => markNotificationRead(n.id).catch(() => addToast('Unable to update notification', 'Please try again.', 'error'))}>
                      Mark Read
                    </button>
                  )}
                  {n.link && (
                    <button className="btn-primary" style={{ fontSize: '10px', padding: '4px 8px' }} onClick={async () => { try { await markNotificationRead(n.id); navigate(n.link) } catch { addToast('Unable to update notification', 'Please try again.', 'error') } }}>
                      Open Record →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
