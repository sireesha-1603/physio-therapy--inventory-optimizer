import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export function ApprovalsOverridePage({ addToast, onOpenOverride }) {
  const { user } = useAuth()
  const { recommendations, updateRecommendation, auditLogs } = useData()
  const [selectedRecId, setSelectedRecId] = useState(null)

  const canApprove = ['administrator', 'inventory_planner', 'procurement_manager', 'finance_reviewer'].includes(user?.role)

  const handleApprove = (rec) => {
    updateRecommendation(rec.id, 'Approved', 'Approved standard AI recommendation', user?.name, user?.roleName)
    addToast('Recommendation Approved', `Approved ${rec.type} for ${rec.item}`, 'success')
  }

  const handleOverrideTrigger = (rec) => {
    setSelectedRecId(rec.id)
    onOpenOverride((overrideData) => {
      updateRecommendation(rec.id, 'Overridden', overrideData.reason, user?.name, user?.roleName)
      addToast('Override Audit Recorded', `Reason logged for ${rec.id}`, 'info')
    })
  }

  const handleDefer = (rec) => {
    setSelectedRecId(rec.id)
    onOpenOverride((overrideData) => {
      updateRecommendation(rec.id, 'Deferred', overrideData.reason, user?.name, user?.roleName)
      addToast('Recommendation Deferred', `Deferred action on ${rec.item}`, 'info')
    })
  }

  return (
    <div>
      <div className="panel" style={{ marginBottom: '20px' }}>
        <div className="panel-head">
          <div>
            <h2>Planner Approval Workbench & Overrides</h2>
            <p>Authorized reviewers can Approve, Edit, Defer, or Override AI outputs with mandatory reason recording</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>REC ID</th>
                <th>RECOMMENDED ACTION</th>
                <th>ITEM & LOCATION</th>
                <th>SUGGESTED QTY</th>
                <th>CONFIDENCE</th>
                <th>AI EXPLANATION</th>
                <th>STATUS</th>
                <th>REVIEW ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.id}</strong></td>
                  <td><span className={`type ${r.type.toLowerCase().replace(' ', '-')}`}>{r.type}</span></td>
                  <td>
                    <strong>{r.item}</strong>
                    <small>{r.location}</small>
                  </td>
                  <td><strong>{r.suggestedQty} units</strong></td>
                  <td><span style={{ color: '#2563eb', fontWeight: 'bold' }}>{r.confidence}%</span></td>
                  <td style={{ maxWidth: '280px', whiteSpace: 'normal', fontSize: '11px' }}>{r.explanation}</td>
                  <td>
                    <span className={`priority ${r.status === 'Approved' ? 'medium' : r.status === 'Overridden' ? 'high' : 'medium'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {canApprove && r.status === 'Pending Review' ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-primary" style={{ padding: '3px 8px', fontSize: '10px' }} onClick={() => handleApprove(r)}>
                          Approve
                        </button>
                        <button className="btn-outline" style={{ padding: '3px 8px', fontSize: '10px' }} onClick={() => handleOverrideTrigger(r)}>
                          Override
                        </button>
                        <button className="btn-outline" style={{ padding: '3px 8px', fontSize: '10px', color: '#d97706' }} onClick={() => handleDefer(r)}>
                          Defer
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Reviewed ✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Audit Trail Log */}
      <div className="panel">
        <div className="panel-head">
          <div>
            <h2>Material Decision Audit Trail</h2>
            <p>Chronological record of actor, timestamp, mandatory justification, previous vs new values</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>AUDIT ID</th>
                <th>ACTOR & ROLE</th>
                <th>ACTION TYPE</th>
                <th>ENTITY TARGET</th>
                <th>MANDATORY JUSTIFICATION / REASON</th>
                <th>TIMESTAMP</th>
                <th>OUTCOME</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id}>
                  <td><strong>{log.id}</strong></td>
                  <td>
                    <strong>{log.actor}</strong>
                    <small>{log.role}</small>
                  </td>
                  <td><span className="type reorder">{log.action}</span></td>
                  <td>{log.entity}</td>
                  <td style={{ maxWidth: '300px', whiteSpace: 'normal' }}>{log.reason}</td>
                  <td><small>{log.timestamp}</small></td>
                  <td><strong style={{ color: log.outcome === 'Overridden' ? '#d97706' : '#16a34a' }}>{log.outcome}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
