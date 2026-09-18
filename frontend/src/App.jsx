import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import FoodList from './pages/FoodList'
import AddFood from './pages/AddFood'
import MyReservations from './pages/MyReservations'
import RestaurantDashboard from './pages/RestaurantDashboard'
import RestaurantProfile from './pages/RestaurantProfile'
import MyFood from './pages/MyFood'
import EditFood from './pages/EditFood'
import NGODashboard from './pages/NGODashboard'
import NGOProfile from './pages/NGOProfile'
import AdminDashboard from './pages/AdminDashboard'
import AdminReservations from './pages/AdminReservations'
import AdminDonations from './pages/AdminDonations'
import AdminFoodNeeds from './pages/AdminFoodNeeds'
import AdminUsers from './pages/AdminUsers'
import AdminFoodListings from './pages/AdminFoodListings'

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
<Route path="/restaurant-profile" element={<RestaurantProfile />} />
<Route path="/my-food" element={<MyFood />} />
<Route path="/edit-food/:id" element={<EditFood />} />
<Route
  path="/ngo"
  element={<NGODashboard />}
/>
<Route
  path="/ngo-profile"
  element={<NGOProfile />}
/>
<Route path="/admin" element={<AdminDashboard />} />
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