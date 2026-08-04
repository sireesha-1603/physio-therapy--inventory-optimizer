import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export function AuditSettingsPage({ addToast }) {
  const { user } = useAuth()
  const { auditLogs } = useData()
  const [activeTab, setActiveTab] = useState('audit') // 'audit' | 'settings'
  const [search, setSearch] = useState('')

  // System Settings state
  const [safetyMultiplier, setSafetyMultiplier] = useState(1.5)
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(85)

  const isAdmin = user?.role === 'administrator'

  const filteredLogs = auditLogs.filter(l => 
    l.actor.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.entity.toLowerCase().includes(search.toLowerCase()) ||
    l.reason.toLowerCase().includes(search.toLowerCase())
  )

  const handleSaveSettings = (e) => {
    e.preventDefault()
    addToast('System Settings Saved', 'Updated reorder thresholds & AI confidence rules', 'success')
  }

  return (
    <div>
      <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`btn-outline ${activeTab === 'audit' ? 'active-tab' : ''}`} onClick={() => setActiveTab('audit')}>
            📜 Searchable Audit Trail Logs
          </button>
          <button className={`btn-outline ${activeTab === 'settings' ? 'active-tab' : ''}`} onClick={() => setActiveTab('settings')}>
            ⚙️ System Master Settings
          </button>
        </div>

        {activeTab === 'audit' && (
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search audit action, actor, entity, reason..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '280px' }}
          />
        )}
      </div>

      {activeTab === 'audit' && (
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>System Audit Logs & Security Tracing</h2>
              <p>Immutable log of authentication, exports, AI executions, overrides, and master data changes</p>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>🔒 Audit records are read-only and immutable</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>AUDIT ID</th>
                  <th>ACTOR & ROLE</th>
                  <th>ACTION PERFORMED</th>
                  <th>TARGET ENTITY</th>
                  <th>MANDATORY JUSTIFICATION</th>
                  <th>PREVIOUS VALUE</th>
                  <th>NEW VALUE</th>
                  <th>TIMESTAMP</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(l => (
                  <tr key={l.id}>
                    <td><strong>{l.id}</strong></td>
                    <td>
                      <strong>{l.actor}</strong>
                      <small>{l.role}</small>
                    </td>
                    <td><span className="type reorder">{l.action}</span></td>
                    <td>{l.entity}</td>
                    <td style={{ maxWidth: '240px', whiteSpace: 'normal', fontSize: '11px' }}>{l.reason}</td>
                    <td><small>{l.prevVal}</small></td>
                    <td><small>{l.newVal}</small></td>
                    <td><small>{l.timestamp}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Master System Settings & Threshold Rule Engine</h2>
              <p>Configure reorder formulas, safety stock multipliers, and AI confidence boundaries</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} style={{ maxWidth: '500px' }}>
            <div className="form-group">
              <label>Safety Stock Lead-Time Multiplier</label>
              <input 
                type="number" 
                step="0.1"
                className="form-input" 
                value={safetyMultiplier} 
                onChange={e => setSafetyMultiplier(Number(e.target.value))}
                disabled={!isAdmin}
              />
            </div>

            <div className="form-group">
              <label>Minimum AI Approval Confidence Threshold: <strong>{aiConfidenceThreshold}%</strong></label>
              <input 
                type="range" 
                min="50" 
                max="99" 
                value={aiConfidenceThreshold} 
                onChange={e => setAiConfidenceThreshold(Number(e.target.value))}
                style={{ width: '100%' }}
                disabled={!isAdmin}
              />
            </div>

            {isAdmin ? (
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                Save System Thresholds
              </button>
            ) : (
              <p style={{ color: '#ef4444', fontSize: '12px' }}>Only Administrators can modify system thresholds.</p>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
