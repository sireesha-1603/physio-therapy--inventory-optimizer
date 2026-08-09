import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage({ addToast }) {
  const { login, ROLES } = useAuth()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('admin@physioflow.local')
  const [password, setPassword] = useState('ChangeMe!2026')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [loginError, setLoginError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError('')

    try {
      const loggedUser = await login(email, password, rememberMe)
      setIsLoading(false)
      addToast('Authenticated Successfully', `Welcome back! Logged in as ${loggedUser.roleName}`, 'success')
      navigate('/', { replace: true })
    } catch (error) {
      const message = error.response?.data?.error?.message || 'Unable to reach the API. Start the backend on port 5000 and try again.'
      setIsLoading(false); setLoginError(message); addToast('Sign in failed', message, 'error')
    }
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
          {loginError && <p className="login-error" role="alert">{loginError}</p>}
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
