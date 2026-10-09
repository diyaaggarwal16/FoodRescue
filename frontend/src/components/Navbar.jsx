import { Link } from 'react-router-dom'

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <h2><Link to="/">FoodRescue</Link></h2>

      <div className="nav-links">
       

        

        {user && user.role === 'CUSTOMER' && (
          <>
          <Link to="/customer/dashboard">
              Dashboard
            </Link>
            <Link to="/food">Explore Food</Link>
          <Link to = "/food-needs">
          Food Needs
          </Link>
          
          <Link to="/my-reservations">
            My Reservations
          </Link></>
        )}

        {user && user.role === 'RESTAURANT' && (
          <>
            <Link to="/restaurant-dashboard">
              Dashboard
            </Link>

            

            <Link to="/add-food">
              Add Food
            </Link>
            <Link to="/my-food">
              My Listings
            </Link>

            <Link to="/restaurant/food-needs">
              Food Needs
            </Link>

            <Link to="/restaurant-profile">
              Profile
            </Link>
          </>
        )}

        {user && user.role === 'NGO' && (
  <>
    <Link to="/ngo">
      NGO Dashboard
    </Link>

    <Link to="/ngo-profile">
      Profile
    </Link>
  </>
)}
{user && user.role === 'ADMIN' && (
  <Link to="/admin">
    Admin Dashboard
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
