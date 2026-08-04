import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

const DEMAND_DRIVERS = [
  { name: 'Session Demand', val: '4,280 sessions/mo', trend: '+14.2%', status: 'good', icon: '📈' },
  { name: 'Therapist Utilisation', val: '88.5% capacity', trend: '+3.1%', status: 'good', icon: '👩‍⚕️' },
  { name: 'Cancellation Rate', val: '4.2%', trend: '-1.5%', status: 'good', icon: '📉' },
  { name: 'Recovery Progress', val: '91.0 / 100', trend: '+4.0%', status: 'good', icon: '💪' },
  { name: 'Plan Adherence', val: '94.8%', trend: '+2.2%', status: 'good', icon: '📋' },
  { name: 'Average Wait Time', val: '8.4 minutes', trend: '-2.1 min', status: 'good', icon: '⏱️' }
]

const DEMAND_TREND = [
  { day: 'Mon', Tapes: 45, Consumables: 88, Braces: 12, TherapyAcc: 24, Hygiene: 60 },
  { day: 'Tue', Tapes: 52, Consumables: 95, Braces: 15, TherapyAcc: 28, Hygiene: 65 },
  { day: 'Wed', Tapes: 48, Consumables: 78, Braces: 11, TherapyAcc: 22, Hygiene: 55 },
  { day: 'Thu', Tapes: 65, Consumables: 110, Braces: 18, TherapyAcc: 35, Hygiene: 80 },
  { day: 'Fri', Tapes: 72, Consumables: 125, Braces: 22, TherapyAcc: 40, Hygiene: 92 },
  { day: 'Sat', Tapes: 58, Consumables: 90, Braces: 14, TherapyAcc: 30, Hygiene: 70 },
  { day: 'Sun', Tapes: 35, Consumables: 60, Braces: 8, TherapyAcc: 15, Hygiene: 45 }
]

export function DashboardPage({ addToast, onOpenOverride }) {
  const { user } = useAuth()
  const { items, recommendations } = useData()
  const navigate = useNavigate()

  const [locationFilter, setLocationFilter] = useState('All Clinics')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')

  const filteredItems = items.filter(i => 
    (locationFilter === 'All Clinics' || i.location.includes(locationFilter)) &&
    (categoryFilter === 'All Categories' || i.category === categoryFilter)
  )

  const totalValue = filteredItems.reduce((acc, curr) => acc + (curr.stock * curr.unitCost), 0)
  const stockoutCount = filteredItems.filter(i => i.stock <= i.safetyStock).length
  const pendingApprovalsCount = recommendations.filter(r => r.status === 'Pending Review').length

  return (
    <div>
      {/* Filters Toolbar */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Clinic Location:</label>
          <select className="form-select" value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
            <option>All Clinics</option>
            <option>Koregaon Park</option>
            <option>Bandra</option>
            <option>Whitefield</option>
            <option>Indiranagar</option>
            <option>Andheri</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Item Category:</label>
          <select className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option>All Categories</option>
            <option>Tapes</option>
            <option>Braces</option>
            <option>Consumables</option>
            <option>Therapy Accessories</option>
            <option>Hygiene Supplies</option>
          </select>
        </div>
      </div>

      {/* Primary Status Indicators / KPIs */}
      <section className="metrics">
        <article className="metric" onClick={() => navigate('/inventory')}>
          <div className="metric-icon blue">₹</div>
          <div>
            <span className="metric-label">Filtered Inventory Value</span>
            <strong>₹{(totalValue / 100000).toFixed(2)}L</strong>
            <small className="good">+8.2% vs last month</small>
          </div>
        </article>

        <article className="metric" onClick={() => navigate('/inventory')}>
          <div className="metric-icon purple">▦</div>
          <div>
            <span className="metric-label">Active SKUs</span>
            <strong>{filteredItems.length}</strong>
            <small className="good">Across 5 categories</small>
          </div>
        </article>

        <article className="metric" onClick={() => navigate('/purchases')}>
          <div className="metric-icon red">!</div>
          <div>
            <span className="metric-label">Stockout / Expiring Risks</span>
            <strong>{stockoutCount} SKUs</strong>
            <small className="warn">Action required</small>
          </div>
        </article>

        <article className="metric" onClick={() => navigate('/approvals')}>
          <div className="metric-icon gold">✓</div>
          <div>
            <span className="metric-label">Pending Planner Approvals</span>
            <strong>{pendingApprovalsCount}</strong>
            <small className="good">Review workbench</small>
          </div>
        </article>
      </section>

      {/* Operational Demand Drivers */}
      <div style={{ marginBottom: '22px' }}>
        <h3 style={{ fontSize: '14px', color: '#475569', marginBottom: '10px' }}>OPERATIONAL DEMAND DRIVERS & CLINIC METRICS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
          {DEMAND_DRIVERS.map((d, idx) => (
            <div key={idx} className="driver-card">
              <span style={{ fontSize: '18px' }}>{d.icon}</span>
              <small style={{ color: '#64748b', fontSize: '10px', display: 'block', margin: '4px 0 2px' }}>{d.name}</small>
              <strong style={{ fontSize: '13px', color: '#1e293b' }}>{d.val}</strong>
              <span className={`tag ${d.status}`} style={{ fontSize: '9px', marginTop: '4px' }}>{d.trend}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Demand Trends & Priority Alerts */}
      <section className="content-grid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Category Demand Trends & Forecasts</h2>
              <p>Weekly demand volume for 5 core physiotherapy supply categories</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={DEMAND_TREND}>
              <CartesianGrid vertical={false} stroke="#edf0f5"/>
              <XAxis dataKey="day" tickLine={false} axisLine={false}/>
              <YAxis tickLine={false} axisLine={false}/>
              <Tooltip/>
              <Area type="monotone" dataKey="Consumables" stroke="#4263eb" fill="#e9efff" strokeWidth={2}/>
              <Area type="monotone" dataKey="Tapes" stroke="#855dd2" fill="#f0eafd" strokeWidth={2}/>
              <Area type="monotone" dataKey="Hygiene" stroke="#22a174" fill="#e6f4ea" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Priority Operational Alerts</h2>
              <p>Role-aware exceptions for {user?.roleName}</p>
            </div>
          </div>

          <div className="alert">
            <i className="red">!</i>
            <div>
              <strong>Therapeutic Ultrasound Gel stock at 2 units</strong>
              <small>Koregaon Park • Below safety threshold (15)</small>
            </div>
            <button onClick={() => navigate('/purchases')}>Restock →</button>
          </div>

          <div className="alert">
            <i className="amber">⚠</i>
            <div>
              <strong>Disinfectant Wipes expiring in 36 days</strong>
              <small>Batch LOT-H2026-09 (80 units at Indiranagar)</small>
            </div>
            <button onClick={() => navigate('/recommendations')}>Transfer →</button>
          </div>

          <div className="alert">
            <i className="blue">✓</i>
            <div>
              <strong>4 AI Recommendations awaiting Planner approval</strong>
              <small>Confidence scores 88% – 96%</small>
            </div>
            <button onClick={() => navigate('/approvals')}>Review →</button>
          </div>
        </div>
      </section>
    </div>
  )
}
