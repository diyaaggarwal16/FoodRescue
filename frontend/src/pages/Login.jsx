import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login({ onLogin }) {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
  event.preventDefault()

  setLoading(true)
  setMessage('')

  try {
    const response = await fetch(
      'http://localhost:8080/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    )

    const text = await response.text()

    let data

    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }

    if (!response.ok) {
      const errorMessage =
        typeof data === 'string'
          ? data
          : data.message || 'Login failed'

      throw new Error(errorMessage)
    }

    onLogin(data)

setMessage('Login successful')

    setTimeout(() => {
      navigate('/')
    }, 1000)
  } catch (error) {
    setMessage(error.message || 'Unable to login')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to continue your FoodRescue journey.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}
        </form>

        <p className="auth-switch">
          Don't have an account?
          <Link to="/register"> Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login