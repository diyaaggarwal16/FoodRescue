import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function RestaurantRegister() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)

  const [ownerName, setOwnerName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [restaurantName, setRestaurantName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNext = (event) => {
    event.preventDefault()

    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    setStep(2)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/register/restaurant',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fullName: ownerName,
            email,
            password,
            restaurantName,
            phone,
            address
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
        setMessage(
          typeof data === 'string'
            ? data
            : data.message || 'Registration failed'
        )

        return
      }

      setMessage(
        'Restaurant account created successfully'
      )

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch {
      setMessage(
        'Unable to connect to the server'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Restaurant Registration</h1>

          <p>
            {step === 1
              ? 'Create your restaurant account.'
              : 'Tell us about your restaurant.'}
          </p>
        </div>

        <div className="registration-progress">
          <span
            className={
              step === 1
                ? 'progress-step active'
                : 'progress-step completed'
            }
          >
            
          </span>

          <span className="progress-line" />

          <span
            className={
              step === 2
                ? 'progress-step active'
                : 'progress-step'
            }
          >
            
          </span>
        </div>

        {step === 1 && (
          <form
            className="auth-form"
            onSubmit={handleNext}
          >
            <div className="input-group">
              <label>Owner Name</label>

              <input
                type="text"
                placeholder="Enter owner name"
                value={ownerName}
                onChange={(event) =>
                  setOwnerName(event.target.value)
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter email address"
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
              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                required
              />
            </div>

            {message && (
              <p className="auth-message">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="auth-btn"
            >
              Continue
            </button>
          </form>
        )}

        {step === 2 && (
          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="input-group">
              <label>Restaurant Name</label>

              <input
                type="text"
                placeholder="Enter restaurant name"
                value={restaurantName}
                onChange={(event) =>
                  setRestaurantName(event.target.value)
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>

              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Restaurant Address</label>

              <textarea
                placeholder="Enter restaurant address"
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                rows="3"
                required
              />
            </div>

            {message && (
              <p className="auth-message">
                {message}
              </p>
            )}

            <div className="registration-actions">
              <button
                type="button"
                className="auth-secondary-btn"
                onClick={() => {
                  setMessage('')
                  setStep(1)
                }}
              >
                Back
              </button>

              <button
                type="submit"
                className="auth-btn"
                disabled={loading}
              >
                {loading
                  ? 'Creating Account...'
                  : 'Create Restaurant Account'}
              </button>
            </div>
          </form>
        )}

        <p className="auth-switch">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  )
}

export default RestaurantRegister