import { useState } from 'react'
import { useData } from '../context/DataContext'

export function PurchasePlanningPage({ addToast, onOpenScenario }) {
  const { suppliers, items } = useData()
  const [activeTab, setActiveTab] = useState('workbench') // 'workbench' | 'scorecards' | 'allocations'
  const [simResults, setSimResults] = useState(null)

  const handleSimulate = (params) => {
    setSimResults(params)
    addToast('Scenario Simulation Executed', `Simulated +${params.demandSpike}% demand surge and +${params.leadTimeDelay}d supplier delay`, 'info')
  }

  return (
    <div>
      {/* Workbench Sub-navigation & Scenario Button */}
      <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`btn-outline ${activeTab === 'workbench' ? 'active-tab' : ''}`} onClick={() => setActiveTab('workbench')}>
            📋 Purchase Planning Workbench
          </button>
          <button className={`btn-outline ${activeTab === 'scorecards' ? 'active-tab' : ''}`} onClick={() => setActiveTab('scorecards')}>
            ⭐ Supplier Scorecards
          </button>
          <button className={`btn-outline ${activeTab === 'allocations' ? 'active-tab' : ''}`} onClick={() => setActiveTab('allocations')}>
            ⇄ Stock Allocations
          </button>
        </div>

        <button className="btn-primary" style={{ background: '#7c3aed' }} onClick={() => onOpenScenario(handleSimulate)}>
          ⚡ Run Scenario Simulation
        </button>
      </div>

      {simResults && (
        <div className="panel" style={{ background: '#f3e8ff', borderColor: '#c084fc', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: '#6b21a8' }}>ACTIVE SIMULATION SCENARIO:</strong>
              <span style={{ fontSize: '13px', marginLeft: '10px' }}>
                Demand Surge (+{simResults.demandSpike}%) • Lead Time Delay (+{simResults.leadTimeDelay} days)
              </span>
            </div>
            <button className="link-btn" onClick={() => setSimResults(null)}>Reset Simulation</button>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#7e22ce' }}>
            Estimated additional safety stock needed: +180 units across 5 clinics. Total budget impact: ₹1.45L.
          </p>
        </div>
      )}

      {activeTab === 'workbench' && (
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Purchase Orders & Replenishment Workbench</h2>
              <p>Active procurement requests and automated reorder triggers</p>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>PO ID</th>
                  <th>RECOMMENDED ITEM</th>
                  <th>PREFERRED SUPPLIER</th>
                  <th>QTY TO ORDER</th>
                  <th>ESTIMATED COST</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>PO-8812</strong></td>
                  <td>Therapeutic Ultrasound Gel 5L</td>
                  <td>MedTech Supplies</td>
                  <td>25 units</td>
                  <td>₹30,000</td>
                  <td><span className="type reorder">Pending Review</span></td>
                  <td><button className="btn-primary" style={{ fontSize: '10px', padding: '4px 8px' }} onClick={() => addToast('PO Created', 'Purchase order generated for MedTech Supplies', 'success')}>Order Now</button></td>
                </tr>
                <tr>
                  <td><strong>PO-8813</strong></td>
                  <td>Surface Disinfectant Wipes (100pk)</td>
                  <td>CleanHygiene Corp</td>
                  <td>100 units</td>
                  <td>₹28,000</td>
                  <td><span className="type transfer">Approved</span></td>
                  <td><span style={{ color: '#22c55e', fontWeight: 'bold' }}>Approved ✓</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'scorecards' && (
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Supplier Performance Scorecards</h2>
              <p>On-time delivery rates, quality compliance, and cost competitiveness</p>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>SUPPLIER NAME</th>
                  <th>CATEGORY SCOPE</th>
                  <th>ON-TIME DELIVERY</th>
                  <th>QUALITY SCORE</th>
                  <th>COST COMPETITIVENESS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.category}</td>
                    <td><strong style={{ color: s.onTimeRate >= 95 ? '#16a34a' : '#d97706' }}>{s.onTimeRate}%</strong></td>
                    <td><strong style={{ color: '#16a34a' }}>{s.qualityScore}%</strong></td>
                    <td><span className="type reorder">{s.costIndex}</span></td>
                    <td><span className={`priority ${s.status === 'Preferred' ? 'medium' : 'high'}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'allocations' && (
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Inter-Clinic Stock Allocations</h2>
              <p>Balanced inventory distribution across clinic locations</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {['Koregaon Park', 'Bandra Clinic', 'Whitefield Center'].map((loc, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '14px', display: 'block', marginBottom: '6px' }}>📍 {loc}</strong>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Capacity Utilisation: 74%</p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>Healthy SKUs: 18 | Critical: 2</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
