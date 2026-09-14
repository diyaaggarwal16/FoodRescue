import { Link } from 'react-router-dom'

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <h2>FoodRescue</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/food">Explore Food</Link>

        {user && user.role === 'CUSTOMER' && (
          <Link to="/my-reservations">
            My Reservations
          </Link>
        )}

        {user && user.role === 'RESTAURANT' && (
          <Link to="/add-food">
            Add Food
          </Link>
        )}

        {user && user.role === 'NGO' && (
          <Link to="/ngo">
            NGO Dashboard
          </Link>
        )}

        {user ? (
          <button
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar