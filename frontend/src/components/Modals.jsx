import { useState } from 'react'

export function OverrideModal({ isOpen, onClose, onSubmit, title = 'Planner Recommendation Override' }) {
  const [reason, setReason] = useState('')
  const [newValue, setNewValue] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reason.trim()) return
    onSubmit({ reason, newValue })
    setReason('')
    setNewValue('')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>⚠️ {title}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
              Every planner decision, edit, deferral, or override requires a mandatory audit reason.
            </p>
            <div className="form-group">
              <label>Proposed New Value / Adjustment (Optional)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Adjusted Qty: 40 units or Deferred 7 Days"
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Mandatory Justification / Reason <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea 
                className="form-input" 
                rows="3"
                placeholder="Explain why the AI suggestion is being edited, overridden, or deferred..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ background: '#d97706' }}>
              Confirm & Audit Override
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ExportModal({ isOpen, onClose, onExport }) {
  const [format, setFormat] = useState('csv')
  const [range, setRange] = useState('Current View')

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📊 Export Filtered Reports</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Export Format</label>
            <select className="form-select" value={format} onChange={e => setFormat(e.target.value)}>
              <option value="csv">CSV (Comma Separated Values)</option>
              <option value="pdf">Formatted PDF Document</option>
              <option value="xlsx">Excel Workbook (.xlsx)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date Scope</label>
            <select className="form-select" value={range} onChange={e => setRange(e.target.value)}>
              <option>Current View</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Year-to-Date (YTD)</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => { onExport(format, range); onClose(); }}>
            Generate & Download
          </button>
        </div>
      </div>
    </div>
  )
}

export function ScenarioModal({ isOpen, onClose, onRunScenario }) {
  const [demandSpike, setDemandSpike] = useState(20)
  const [leadTimeDelay, setLeadTimeDelay] = useState(5)

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>⚡ Purchase Workbench Scenario Simulation</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Demand Surge Factor: <strong>+{demandSpike}%</strong></label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={demandSpike} 
              onChange={e => setDemandSpike(Number(e.target.value))} 
              style={{ width: '100%' }}
            />
          </div>
          <div className="form-group">
            <label>Supplier Lead Time Delay: <strong>+{leadTimeDelay} days</strong></label>
            <input 
              type="range" 
              min="0" 
              max="30" 
              value={leadTimeDelay} 
              onChange={e => setLeadTimeDelay(Number(e.target.value))} 
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => { onRunScenario({ demandSpike, leadTimeDelay }); onClose(); }}>
            Run Simulation
          </button>
        </div>
      </div>
    </div>
  )
}
