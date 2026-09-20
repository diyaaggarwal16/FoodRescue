import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { startTokenExpiryTimer } from '../utils/api'

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

function LoginLogo() {
  return (
    <div className="login-logo">
      <svg
        viewBox="0 0 80 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M40 62C39 47 31 35 17 30C13 28 9 24 8 18C21 17 34 21 40 34V62Z"
          fill="url(#leafOne)"
        />

        <path
          d="M40 62C41 47 49 35 63 30C67 28 71 24 72 18C59 17 46 21 40 34V62Z"
          fill="url(#leafTwo)"
        />

        <path
          d="M40 62V31"
          stroke="#E9D5FF"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient
            id="leafOne"
            x1="10"
            y1="18"
            x2="42"
            y2="58"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E9D5FF" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>

          <linearGradient
            id="leafTwo"
            x1="70"
            y1="18"
            x2="38"
            y2="58"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F3E8FF" />
            <stop offset="1" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

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

      localStorage.setItem('token', data.token)

      startTokenExpiryTimer()

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
    <main className="login-scene">
      <div className="login-orb login-orb-one"></div>
      <div className="login-orb login-orb-two"></div>
      <div className="login-orb login-orb-three"></div>

      <div className="login-ring login-ring-one"></div>
      <div className="login-ring login-ring-two"></div>

      <div className="login-horizon"></div>

      <section className="login-layout">
        <div className="login-card">
          <div className="login-card-content">
            <div className="login-card-brand">
              <LoginLogo />

              <h2>FoodRescue</h2>

              <span>REAL FOOD. REAL CHANGE.</span>
            </div>

            <div className="login-heading">
              <h3>Welcome Back</h3>

              <p>
                Login to continue your FoodRescue journey.
              </p>
            </div>

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >
              <div className="login-field">
                <label htmlFor="email">
                  Email Address
                </label>

                <div className="login-input">
                  <span>
                    <MailIcon />
                  </span>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <div className="login-password-label">
                  <label htmlFor="password">
                    Password
                  </label>

                  <Link to="/forgot-password">
                    Forgot Password?
                  </Link>
                </div>

                <div className="login-input">
                  <span>
                    <LockIcon />
                  </span>

                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {message && (
                <div
                  className={
                    message === 'Login successful'
                      ? 'login-message success'
                      : 'login-message error'
                  }
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                <span>
                  {loading ? 'Logging in...' : 'Login'}
                </span>

                {!loading && (
                  <span className="login-button-arrow">
                    →
                  </span>
                )}
              </button>
            </form>

            <div className="login-create">
              <span></span>

              <p>
                Don't have an account?{' '}
                <Link to="/register">
                  Create one
                </Link>
              </p>

              <span></span>
            </div>
          </div>
        </div>
      </section>

      <footer className="login-footer">
        <span>
          © 2026 FoodRescue. All rights reserved.
        </span>

        <div>
          <a href="/">Privacy</a>
          <a href="/">Terms</a>
          <a href="/">Contact</a>
        </div>
      </footer>
    </main>
  )
}

export default Login