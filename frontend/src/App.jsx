import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

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

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')

    return storedUser ? JSON.parse(storedUser) : null
  })

  const handleLogin = (loggedInUser) => {
    localStorage.setItem('user', JSON.stringify(loggedInUser))
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />

        <Route path="/register" element={<Register />} />

        <Route path="/food" element={<FoodList />} />

        <Route
          path="/add-food"
          element={<AddFood />}
        />

        <Route
          path="/my-reservations"
          element={<MyReservations />}
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

        <Route
          path="/ngo"
          element={<NGODashboard />}
        />

        <Route
          path="/ngo-profile"
          element={<NGOProfile />}
        />

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
      </Routes>
    </BrowserRouter>
  )
}

export default App