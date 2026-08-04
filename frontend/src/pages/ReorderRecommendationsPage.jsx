import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export function ReorderRecommendationsPage({ addToast, onOpenOverride }) {
  const { user } = useAuth()
  const { recommendations, updateRecommendation } = useData()

  const handleAccept = (rec) => {
    updateRecommendation(rec.id, 'Approved', 'Accepted AI recommendation', user?.name, user?.roleName)
    addToast('Recommendation Accepted', `Accepted ${rec.type} for ${rec.item}`, 'success')
  }

  const handleReject = (rec) => {
    onOpenOverride((overrideData) => {
      updateRecommendation(rec.id, 'Rejected', overrideData.reason, user?.name, user?.roleName)
      addToast('Recommendation Rejected', `Rejected ${rec.item}`, 'info')
    })
  }

  return (
    <div>
      <div className="panel" style={{ marginBottom: '20px' }}>
        <div className="panel-head">
          <div>
            <h2>AI Reorder, Stock Transfer & Supplier Recommendations <span className="spark">✦</span></h2>
            <p>Automated suggestions based on service level targets (98%), expiry risks, and contractual supplier MOQs</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {recommendations.map(r => (
            <div key={r.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className={`type ${r.type.toLowerCase().replace(' ', '-')}`}>{r.type}</span>
                <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: 'bold' }}>✦ AI Confidence {r.confidence}%</span>
              </div>
              <strong style={{ fontSize: '14px', color: '#1e293b', display: 'block' }}>{r.item}</strong>
              <small style={{ color: '#64748b', display: 'block', margin: '2px 0 10px' }}>{r.location} • Window: {r.window}</small>
              
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', fontSize: '11px', color: '#475569', marginBottom: '14px' }}>
                <strong>Evidence:</strong> {r.explanation}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`priority ${r.status === 'Approved' ? 'medium' : 'high'}`}>{r.status}</span>
                {r.status === 'Pending Review' ? (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn-primary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => handleAccept(r)}>
                      Accept
                    </button>
                    <button className="btn-outline" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => handleReject(r)}>
                      Override / Reject
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>Decision Saved ✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
