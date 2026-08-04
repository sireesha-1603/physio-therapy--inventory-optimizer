import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const ACCURACY_DATA = [
  { category: 'Tapes', Predicted: 100, Actual: 94, Accuracy: '94.0%' },
  { category: 'Braces', Predicted: 45, Actual: 42, Accuracy: '93.3%' },
  { category: 'Consumables', Predicted: 350, Actual: 362, Accuracy: '96.5%' },
  { category: 'Accessories', Predicted: 120, Actual: 115, Accuracy: '95.8%' },
  { category: 'Hygiene', Predicted: 200, Actual: 190, Accuracy: '95.0%' }
]

export function InventoryOutcomesPage({ addToast }) {
  const [feedback, setFeedback] = useState('')
  const [submittedFeedback, setSubmittedFeedback] = useState([])

  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    if (!feedback.trim()) return
    setSubmittedFeedback([feedback, ...submittedFeedback])
    addToast('Feedback Saved', 'Captured model outcome feedback', 'success')
    setFeedback('')
  }

  return (
    <div>
      {/* Model Health KPIs */}
      <section className="metrics">
        <article className="metric">
          <div className="metric-icon blue">🎯</div>
          <div>
            <span className="metric-label">Overall Forecast Accuracy</span>
            <strong>94.8%</strong>
            <small className="good">MAPE &lt; 5.2%</small>
          </div>
        </article>

        <article className="metric">
          <div className="metric-icon purple">📊</div>
          <div>
            <span className="metric-label">Model Drift Index</span>
            <strong>1.2%</strong>
            <small className="good">Within tolerance (±3.0%)</small>
          </div>
        </article>

        <article className="metric">
          <div className="metric-icon gold">⚡</div>
          <div>
            <span className="metric-label">Prediction Latency</span>
            <strong>140 ms</strong>
            <small className="good">Real-time inference</small>
          </div>
        </article>

        <article className="metric">
          <div className="metric-icon red">📈</div>
          <div>
            <span className="metric-label">Planner Adoption Rate</span>
            <strong>89.4%</strong>
            <small className="good">AI Recommendations Accepted</small>
          </div>
        </article>
      </section>

      {/* Chart: Actual vs Predicted Outcomes */}
      <div className="panel" style={{ marginBottom: '22px' }}>
        <div className="panel-head">
          <div>
            <h2>Actual vs Recommended Outcomes by Category</h2>
            <p>Evaluating demand forecast accuracy against real clinic consumption</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={ACCURACY_DATA}>
            <CartesianGrid vertical={false} stroke="#edf0f5"/>
            <XAxis dataKey="category" axisLine={false} tickLine={false}/>
            <YAxis axisLine={false} tickLine={false}/>
            <Tooltip/>
            <Bar dataKey="Predicted" fill="#c7d2fe" radius={[4, 4, 0, 0]}/>
            <Bar dataKey="Actual" fill="#4f46e5" radius={[4, 4, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Model Feedback Capture */}
      <div className="panel">
        <div className="panel-head">
          <div>
            <h2>Capture Outcome Feedback & Model Observations</h2>
            <p>Log observations to assist with retraining and prompt tuning</p>
          </div>
        </div>
        <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. Ultrasound Gel demand spiked on Tuesday due to extra workshop..." 
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            Submit Observation
          </button>
        </form>

        {submittedFeedback.length > 0 && (
          <div style={{ marginTop: '14px' }}>
            <strong style={{ fontSize: '12px', color: '#64748b' }}>Recent Feedback Logs:</strong>
            <ul style={{ fontSize: '12px', paddingLeft: '18px', marginTop: '6px', color: '#334155' }}>
              {submittedFeedback.map((fb, idx) => (
                <li key={idx}>{fb}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
