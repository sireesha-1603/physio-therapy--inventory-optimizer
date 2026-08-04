import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage({ addToast }) {
  const { login, ROLES } = useAuth()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('arjun.sharma@physioflow.local')
  const [password, setPassword] = useState('Password123!')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [selectedRole, setSelectedRole] = useState('inventory_planner')
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      login(email, password, selectedRole, rememberMe)
      setIsLoading(false)
      addToast('Authenticated Successfully', `Welcome back! Logged in as ${ROLES[selectedRole.toUpperCase()]?.name}`, 'success')
      navigate('/')
    }, 600)
  }

  const handleForgotSubmit = (e) => {
    e.preventDefault()
    addToast('Reset Instructions Sent', `Password reset link sent to ${forgotEmail}`, 'info')
    setShowForgotPassword(false)
    setForgotEmail('')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <span className="brand-mark">+</span>
          <h2>physio<span>flow</span></h2>
        </div>
        <p className="login-subtitle">Physiotherapy Demand, Supply & Inventory Optimiser</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Work Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@physioflow.local"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="form-input" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Assigned Role (RBAC Target)</label>
            <select className="form-select" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
              {Object.values(ROLES).map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.scope})</option>
              ))}
            </select>
          </div>

          <div className="login-row">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={e => setRememberMe(e.target.checked)} 
              />
              Remember me on this browser
            </label>
            <button type="button" className="link-btn" onClick={() => setShowForgotPassword(true)}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={isLoading}>
            {isLoading ? 'Authenticating with JWT...' : 'Sign In to Workspace'}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reset Password</h3>
              <button className="close-btn" onClick={() => setShowForgotPassword(false)}>✕</button>
            </div>
            <form onSubmit={handleForgotSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Enter your registered work email address. If the account exists, password reset instructions will be issued.
                </p>
                <div className="form-group" style={{ marginTop: '14px' }}>
                  <label>Work Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="name@physioflow.local"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setShowForgotPassword(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Send Reset Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
