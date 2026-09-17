import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fullName,
            email,
            password,
            role
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

if (response.ok) {
  setMessage('Account created successfully')

  setTimeout(() => {
    navigate('/login')
  }, 1500)
} else {
  setMessage(
    typeof data === 'string'
      ? data
      : data.message || 'Registration failed'
  )
}
    } catch (error) {
      setMessage('Unable to connect to the server')
    }

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join FoodRescue and help reduce food waste.</p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="input-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          <div className="input-group">
            <label>Account Type</label>

            <select
              value={role}
              onChange={(event) =>
                setRole(event.target.value)
              }
              required
            >
              <option value="">
                Select your role
              </option>

              <option value="CUSTOMER">
                Customer
              </option>

              <option value="RESTAURANT">
                Restaurant
              </option>

              <option value="NGO">
                NGO
              </option>
            </select>
          </div>

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading
              ? 'Creating Account...'
              : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register