import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom'
import { logoutUser } from './utils/api'

import './App.css'

import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CustomerRegister from './pages/CustomerRegister'
import RestaurantRegister from './pages/RestaurantRegister'
import NGORegister from './pages/NGORegister'
import ForgotPassword from './pages/ForgotPassword'

import FoodList from './pages/dashboards/customer/FoodList'
import MyReservations from './pages/dashboards/customer/MyReservations'

import AddFood from './pages/dashboards/restaurant/AddFood'
import EditFood from './pages/dashboards/restaurant/EditFood'
import MyFood from './pages/dashboards/restaurant/MyFood'
import RestaurantDashboard from './pages/dashboards/restaurant/RestaurantDashboard'
import RestaurantProfile from './pages/dashboards/restaurant/RestaurantProfile'

import NGODashboard from './pages/dashboards/ngo/NGODashboard'
import NGOProfile from './pages/dashboards/ngo/NGOProfile'

import AdminDashboard from './pages/dashboards/admin/AdminDashboard'
import AdminReservations from './pages/dashboards/admin/AdminReservations'
import AdminDonations from './pages/dashboards/admin/AdminDonations'
import AdminFoodNeeds from './pages/dashboards/admin/AdminFoodNeeds'
import AdminUsers from './pages/dashboards/admin/AdminUsers'
import AdminFoodListings from './pages/dashboards/admin/AdminFoodListings'

function AppContent() {
  const navigate = useNavigate()

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      return null
    }

    try {
      return JSON.parse(storedUser)
    } catch {
      localStorage.removeItem('user')
      localStorage.removeItem('token')

      return null
    }
  })

  const [sessionExpired, setSessionExpired] =
    useState(false)

  const handleLogin = (loggedInUser) => {
    localStorage.setItem(
      'user',
      JSON.stringify(loggedInUser)
    )

    setUser(loggedInUser)
    setSessionExpired(false)
  }

  const handleLogout = () => {
    logoutUser()

    setUser(null)

    navigate('/login')
  }

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null)
      setSessionExpired(true)
    }

    window.addEventListener(
      'auth:session-expired',
      handleSessionExpired
    )

    return () => {
      window.removeEventListener(
        'auth:session-expired',
        handleSessionExpired
      )
    }
  }, [])

  const handleSessionExpiredLogin = () => {
    setSessionExpired(false)

    navigate('/login', {
      replace: true
    })
  }

  return (
    <>
      <Navbar
        user={user}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={
            <Login
              onLogin={handleLogin}
            />
          }
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/register/customer"
          element={<CustomerRegister />}
        />

        <Route
          path="/register/restaurant"
          element={<RestaurantRegister />}
        />

        <Route
          path="/register/ngo"
          element={<NGORegister />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          element={
            <ProtectedRoute
              allowedRoles={['CUSTOMER']}
            />
          }
        >
          <Route
            path="/food"
            element={<FoodList />}
          />

          <Route
            path="/my-reservations"
            element={<MyReservations />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={['RESTAURANT']}
            />
          }
        >
          <Route
            path="/add-food"
            element={<AddFood />}
          />

          <Route
            path="/restaurant-dashboard"
            element={<RestaurantDashboard />}
          />

          <Route
            path="/restaurant-profile"
            element={<RestaurantProfile />}
          />

          <Route
            path="/my-food"
            element={<MyFood />}
          />

          <Route
            path="/edit-food/:id"
            element={<EditFood />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={['NGO']}
            />
          }
        >
          <Route
            path="/ngo"
            element={<NGODashboard />}
          />

          <Route
            path="/ngo-profile"
            element={<NGOProfile />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={['ADMIN']}
            />
          }
        >
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/reservations"
            element={<AdminReservations />}
          />

          <Route
            path="/admin/donations"
            element={<AdminDonations />}
          />

          <Route
            path="/admin/food-needs"
            element={<AdminFoodNeeds />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          <Route
            path="/admin/food-listings"
            element={<AdminFoodListings />}
          />
        </Route>
      </Routes>

      {sessionExpired && (
        <div className="session-expired-overlay">
          <div className="session-expired-modal">
            <h2>Session Expired</h2>

            <p>
              Your session has expired.
              Please login again to continue.
            </p>

            <button
              type="button"
              onClick={handleSessionExpiredLogin}
            >
              Login Again
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App