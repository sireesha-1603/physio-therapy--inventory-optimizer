import { useState } from 'react'
import { useData } from '../context/DataContext'

export function ReportsAnalyticsPage({ addToast, onOpenExport }) {
  const { items } = useData()
  const [reportHistory, setReportHistory] = useState([
    { id: 'RPT-101', name: 'Monthly Inventory Valuation & Risk Report', format: 'PDF', date: '2026-08-01', status: 'Completed', size: '2.4 MB' },
    { id: 'RPT-102', name: '5-Category Demand & Stockout Audit', format: 'CSV', date: '2026-08-03', status: 'Completed', size: '480 KB' },
    { id: 'RPT-103', name: 'Supplier Scorecard & Lead Time Analytics', format: 'XLSX', date: '2026-08-04', status: 'Completed', size: '1.1 MB' }
  ])

  const handleNewExport = (format, range) => {
    const newReport = {
      id: `RPT-${Date.now().toString().slice(-3)}`,
      name: `PhysioFlow Operational Report (${range})`,
      format: format.toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      size: '1.8 MB'
    }
    setReportHistory([newReport, ...reportHistory])
    addToast('Report Exported', `Generated ${newReport.name} in ${newReport.format}`, 'success')
  }

  return (
    <div>
      <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
        <div>
          <strong style={{ fontSize: '13px', color: '#475569' }}>Analytics Module & Report Exporter</strong>
        </div>
        <button className="btn-primary" onClick={onOpenExport}>
          📊 Generate Custom Report
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '22px' }}>
        <div className="panel">
          <strong style={{ fontSize: '13px', color: '#64748b' }}>TOTAL INVENTORY VALUE</strong>
          <h2 style={{ fontSize: '24px', margin: '6px 0 0', color: '#1e293b' }}>₹24.8 Lakhs</h2>
          <small className="good" style={{ fontSize: '11px' }}>Across 5 Categories & 5 Clinics</small>
        </div>

        <div className="panel">
          <strong style={{ fontSize: '13px', color: '#64748b' }}>AVERAGE SERVICE LEVEL</strong>
          <h2 style={{ fontSize: '24px', margin: '6px 0 0', color: '#16a34a' }}>98.4%</h2>
          <small className="good" style={{ fontSize: '11px' }}>Target SLA: 98.0%</small>
        </div>

        <div className="panel">
          <strong style={{ fontSize: '13px', color: '#64748b' }}>STOCKOUT MITIGATION RATE</strong>
          <h2 style={{ fontSize: '24px', margin: '6px 0 0', color: '#2563eb' }}>96.1%</h2>
          <small style={{ fontSize: '11px', color: '#64748b' }}>Prevented by AI Reorder Alerts</small>
        </div>
      </div>

      {/* Report Generation History */}
      <div className="panel">
        <div className="panel-head">
          <div>
            <h2>Report Generation History & Download Center</h2>
            <p>Access generated CSV, PDF, and Excel export files</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>REPORT ID</th>
                <th>REPORT NAME</th>
                <th>FORMAT</th>
                <th>GENERATED DATE</th>
                <th>FILE SIZE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {reportHistory.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.id}</strong></td>
                  <td><strong>{r.name}</strong></td>
                  <td><span className="type reorder">{r.format}</span></td>
                  <td>{r.date}</td>
                  <td>{r.size}</td>
                  <td><span style={{ color: '#16a34a', fontWeight: 'bold' }}>{r.status} ✓</span></td>
                  <td>
                    <button className="btn-outline" style={{ padding: '3px 8px', fontSize: '10px' }} onClick={() => addToast('Download Started', `Downloading ${r.name}`, 'info')}>
                      ⇩ Download File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
