import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  return (
    <div className="auth-page">
      <div className="auth-card registration-choice-card">
        <div className="auth-header">
          <h1>Create Account</h1>

          <p>
            Choose how you want to use FoodRescue.
          </p>
        </div>

        <div className="registration-options">
          <button
            type="button"
            className="registration-option"
            onClick={() => navigate('/register/customer')}
          >
            <span className="registration-icon">
              👤
            </span>

            <span className="registration-content">
              <span className="registration-title">
                Customer
              </span>

              <span className="registration-description">
                Discover surplus food at discounted prices
                and reserve meals for pickup.
              </span>
            </span>

            <span className="registration-arrow">
              →
            </span>
          </button>

          <button
            type="button"
            className="registration-option"
            onClick={() => navigate('/register/restaurant')}
          >
            <span className="registration-icon restaurant-icon">
              🏪
            </span>

            <span className="registration-content">
              <span className="registration-title">
                Restaurant
              </span>

              <span className="registration-description">
                List your surplus food and connect with
                customers and NGOs.
              </span>
            </span>

            <span className="registration-arrow">
              →
            </span>
          </button>

          <button
            type="button"
            className="registration-option"
            onClick={() => navigate('/register/ngo')}
          >
            <span className="registration-icon ngo-icon">
              👥
            </span>

            <span className="registration-content">
              <span className="registration-title">
                NGO
              </span>

              <span className="registration-description">
                Receive donated meals and create food
                needs for your organization.
              </span>
            </span>

            <span className="registration-arrow">
              →
            </span>
          </button>
        </div>

        <p className="auth-switch">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register