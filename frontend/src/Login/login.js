import './login.css'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)
      const data = await login(email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('name', data.name)
      localStorage.setItem('hasCompletedSurvey', data.hasCompletedSurvey)
      navigate('/home')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-container">
      <h1 className="login-logo">YouWork</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            className="login-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
            className="login-input"
          />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="login-button"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
        <Link 
          to="/register" 
          className="register-link" 
          tabIndex={isSubmitting ? -1 : 0}
        >
          Don't have an account? Register
        </Link>
      </form>
    </div>
  )
}