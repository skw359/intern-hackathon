import './login.css'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await login(email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.userId)
      navigate('/home')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="login-container">
      <h1 className="login-logo">YouWork</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>
        }
        <label>Email</label>
        <input
          type="email"
          placeholder="Value"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Value"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
        <Link to="/register" className="forgot-link">Don't have an account? Register</Link>
      </form>
    </div>
  )
}