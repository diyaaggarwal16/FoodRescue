import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function ForgotPassword() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequestOtp = async (event) => {
    event.preventDefault()

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/password-reset/request',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.message || 'Unable to generate OTP'
        )

        return
      }

      setMessage(
        'OTP generated. Check the backend console.'
      )

      setStep(2)
    } catch {
      setMessage(
        'Unable to connect to the server'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/password-reset/verify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            otp
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.message || 'Invalid OTP'
        )

        return
      }

      setMessage('OTP verified successfully')

      setStep(3)
    } catch {
      setMessage(
        'Unable to connect to the server'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()

    setMessage('')

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/password-reset/reset',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.message || 'Password reset failed'
        )

        return
      }

      setMessage(
        'Password reset successfully. Redirecting to login...'
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
          <h1>Forgot Password</h1>

          <p>
            {step === 1 &&
              'Enter your registered email address.'}

            {step === 2 &&
              'Enter the OTP shown in the backend console.'}

            {step === 3 &&
              'Create a new password for your account.'}
          </p>
        </div>

        <div className="registration-progress">
          <span
            className={
              step >= 1
                ? 'progress-step active'
                : 'progress-step'
            }
          >
            
          </span>

          <span className="progress-line" />

          <span
            className={
              step >= 2
                ? 'progress-step active'
                : 'progress-step'
            }
          >
            
          </span>

          <span className="progress-line" />

          <span
            className={
              step >= 3
                ? 'progress-step active'
                : 'progress-step'
            }
          >
            
          </span>
        </div>

        {step === 1 && (
          <form
            className="auth-form"
            onSubmit={handleRequestOtp}
          >
            <div className="input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
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
              disabled={loading}
            >
              {loading
                ? 'Generating OTP...'
                : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form
            className="auth-form"
            onSubmit={handleVerifyOtp}
          >
            <div className="input-group">
              <label>OTP</label>

              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value)
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
              disabled={loading}
            >
              {loading
                ? 'Verifying...'
                : 'Verify OTP'}
            </button>

            <button
              type="button"
              className="auth-secondary-btn"
              onClick={() => {
                setMessage('')
                setStep(1)
                setOtp('')
              }}
            >
              Change Email
            </button>
          </form>
        )}

        {step === 3 && (
          <form
            className="auth-form"
            onSubmit={handleResetPassword}
          >
            <div className="input-group">
              <label>New Password</label>

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm New Password</label>

              <input
                type="password"
                placeholder="Confirm new password"
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
              disabled={loading}
            >
              {loading
                ? 'Updating Password...'
                : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="auth-switch">
          Remember your password?
          <Link to="/login">
            {' '}Back to Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default ForgotPassword