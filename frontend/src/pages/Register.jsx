import { Link } from 'react-router-dom'

function Register() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join FoodRescue and help reduce food waste.</p>
        </div>

        <form className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
            />
          </div>

          <div className="input-group">
            <label>Account Type</label>

            <select>
              <option value="">Select your role</option>
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant</option>
              <option value="ngo">NGO</option>
            </select>
          </div>

          <button type="submit" className="auth-btn">
            Create Account
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