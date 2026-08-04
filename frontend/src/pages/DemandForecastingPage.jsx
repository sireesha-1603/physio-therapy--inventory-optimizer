import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const FORECAST_DATA = [
  { month: 'May 2026', Actual: 320, Forecast: 310 },
  { month: 'Jun 2026', Actual: 380, Forecast: 375 },
  { month: 'Jul 2026', Actual: 410, Forecast: 420 },
  { month: 'Aug 2026 (Pred)', Forecast: 480 },
  { month: 'Sep 2026 (Pred)', Forecast: 520 },
  { month: 'Oct 2026 (Pred)', Forecast: 490 }
]

export function DemandForecastingPage({ addToast }) {
  const [modelState, setModelState] = useState('normal') // 'normal' | 'loading' | 'lowConfidence' | 'insufficientData' | 'unavailable'
  const [selectedCategory, setSelectedCategory] = useState('Consumables')

  return (
    <div>
      {/* Category & Model Edge State Controls */}
      <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
        <div className="filter-group">
          <label>Target Item Category:</label>
          <select className="form-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option>Tapes</option>
            <option>Braces</option>
            <option>Consumables</option>
            <option>Therapy Accessories</option>
            <option>Hygiene Supplies</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Model Execution State Test:</label>
          <select className="form-select" value={modelState} onChange={e => setModelState(e.target.value)}>
            <option value="normal">Normal Prediction (High Confidence 94.2%)</option>
            <option value="loading">Loading State</option>
            <option value="lowConfidence">Low Confidence State (&lt;60%)</option>
            <option value="insufficientData">Insufficient Data Warning</option>
            <option value="unavailable">Unavailable Model Exception</option>
          </select>
        </div>
      </div>

      {modelState === 'loading' && (
        <div className="panel" style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '14px', color: '#64748b' }}>Running AI Demand Forecasting Model (PhysioDemand-v2.4)...</p>
        </div>
      )}

      {modelState === 'unavailable' && (
        <div className="panel" style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
          <h3 style={{ color: '#991b1b', margin: '0 0 6px' }}>⚠️ Model Execution Unavailable</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#7f1d1d' }}>
            The backend forecasting engine could not establish connection to the Gemini API endpoint. Falling back to historical moving averages.
          </p>
        </div>
      )}

      {modelState === 'insufficientData' && (
        <div className="panel" style={{ background: '#fffbe8', borderColor: '#fde047' }}>
          <h3 style={{ color: '#854d0e', margin: '0 0 6px' }}>⚠ Insufficient Historical Data</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#713f12' }}>
            Category "{selectedCategory}" has less than 30 days of active telemetry data. Forecast accuracy confidence is reduced.
          </p>
        </div>
      )}

      {modelState !== 'loading' && modelState !== 'unavailable' && (
        <div>
          {/* Forecast Result Card & Evidence */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '22px', marginBottom: '22px' }}>
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h2>Demand Forecast — {selectedCategory}</h2>
                  <p>Model Version: PhysioDemand-v2.4-Gemini • Timestamp: 2026-08-04 16:00 UTC</p>
                </div>
                <span className="priority medium" style={{ background: modelState === 'lowConfidence' ? '#fee2e2' : '#dcfce7', color: modelState === 'lowConfidence' ? '#991b1b' : '#166534', fontSize: '11px' }}>
                  {modelState === 'lowConfidence' ? 'Low Confidence (54.1%)' : 'High Confidence Score: 94.2%'}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={FORECAST_DATA}>
                  <CartesianGrid vertical={false} stroke="#edf0f5"/>
                  <XAxis dataKey="month" tickLine={false} axisLine={false}/>
                  <YAxis tickLine={false} axisLine={false}/>
                  <Tooltip/>
                  <Area type="monotone" dataKey="Actual" stroke="#94a3b8" fill="#f1f5f9" strokeWidth={2}/>
                  <Area type="monotone" dataKey="Forecast" stroke="#4f46e5" fill="#e0e7ff" strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <h2>Contributing Inputs & Evidence</h2>
                  <p>Underlying demand drivers</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                  <strong>Session Growth Driver:</strong> +18% increase in sports rehab clinic bookings for Q3.
                </div>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                  <strong>Seasonality Index:</strong> Monsoon humidity increases tape & gel usage by 1.25x.
                </div>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                  <strong>Therapist Utilisation:</strong> 88.5% capacity across Koregaon Park & Bandra.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
