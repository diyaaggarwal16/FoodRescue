import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiFetch, logoutUser } from '../../../utils/api'
import '../../../styles/restaurant.css'

function RestaurantDashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  const [restaurant, setRestaurant] = useState(null)
  const [dashboardStats, setDashboardStats] = useState(null)
  const [foodItems, setFoodItems] = useState([])
  const [reservations, setReservations] = useState([])
  const [donatedMeals, setDonatedMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [otpValues, setOtpValues] = useState({})

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setMessage('')

      const profileResponse = await apiFetch('/api/restaurants/my-profile')

      if (profileResponse.status === 404) {
        setRestaurant(null)
        setDashboardStats(null)
        setFoodItems([])
        setReservations([])
        setDonatedMeals([])
        return
      }

      const profileData = await profileResponse.json()

      if (!profileResponse.ok) {
        throw new Error('Failed to load restaurant profile')
      }

      setRestaurant(profileData)

      const dashboardResponse = await apiFetch('/api/restaurants/dashboard')

      if (!dashboardResponse.ok) {
        throw new Error('Failed to load dashboard statistics')
      }

      const dashboardData = await dashboardResponse.json()
      setDashboardStats(dashboardData)

      const foodResponse = await apiFetch(`/api/food/restaurant/${profileData.id}`)

      if (!foodResponse.ok) {
        throw new Error('Failed to load food listings')
      }

      const foodData = await foodResponse.json()
      setFoodItems(foodData)

      const reservationResponse = await apiFetch(
        `/api/reservations/restaurant/${profileData.id}`
      )

      if (reservationResponse.ok) {
        const reservationData = await reservationResponse.json()
        setReservations(reservationData)
      } else {
        setReservations([])
      }

      const donatedResponse = await apiFetch(
        `/api/donated-meals/restaurant/${profileData.id}`
      )

      if (donatedResponse.ok) {
        const donatedData = await donatedResponse.json()
        setDonatedMeals(donatedData)
      } else {
        setDonatedMeals([])
      }
    } catch (error) {
      setMessage(error.message || 'Unable to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const markReservationReady = async (reservationId) => {
    try {
      setMessage('')
      const response = await apiFetch(
        `/api/reservations/${reservationId}/ready`,
        { method: 'PUT' }
      )
      const data = await response.text()
      if (!response.ok) {
        setMessage(data || 'Unable to mark reservation ready')
        return
      }
      setMessage('Reservation is ready for pickup')
      await loadDashboard()
    } catch {
      setMessage('Unable to mark reservation ready')
    }
  }

  const markDonatedMealReady = async (mealId) => {
    try {
      setMessage('')
      const response = await apiFetch(
        `/api/donated-meals/${mealId}/ready`,
        { method: 'PUT' }
      )
      const data = await response.text()
      if (!response.ok) {
        setMessage(data || 'Unable to mark donated meal ready')
        return
      }
      setMessage('Donated meal is ready for pickup')
      await loadDashboard()
    } catch {
      setMessage('Unable to mark donated meal ready')
    }
  }

  const verifyReservationOtp = async (reservationId) => {
    try {
      setMessage('')
      const otp = otpValues[`reservation-${reservationId}`]
      if (!otp || otp.length !== 6) {
        setMessage('Please enter the 6-digit OTP')
        return
      }
      const response = await apiFetch(
        `/api/reservations/${reservationId}/verify-otp`,
        { method: 'PUT', body: JSON.stringify(otp) }
      )
      const data = await response.text()
      if (!response.ok) {
        setMessage(data || 'Unable to verify pickup OTP')
        return
      }
      setMessage('Customer pickup verified successfully')
      setOtpValues((current) => {
        const updated = { ...current }
        delete updated[`reservation-${reservationId}`]
        return updated
      })
      await loadDashboard()
    } catch {
      setMessage('Unable to verify pickup OTP')
    }
  }

  const verifyDonatedMealOtp = async (mealId) => {
    try {
      setMessage('')
      const otp = otpValues[`meal-${mealId}`]
      if (!otp || otp.length !== 6) {
        setMessage('Please enter the 6-digit OTP')
        return
      }
      const response = await apiFetch(
        `/api/donated-meals/${mealId}/verify-otp`,
        { method: 'PUT', body: JSON.stringify(otp) }
      )
      const data = await response.text()
      if (!response.ok) {
        setMessage(data || 'Unable to verify pickup OTP')
        return
      }
      setMessage('NGO pickup verified successfully')
      setOtpValues((current) => {
        const updated = { ...current }
        delete updated[`meal-${mealId}`]
        return updated
      })
      await loadDashboard()
    } catch {
      setMessage('Unable to verify pickup OTP')
    }
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'reserved') return 'reserved'
    if (s === 'ready_for_pickup') return 'ready'
    if (s === 'claimed') return 'claimed'
    if (s === 'completed' || s === 'picked_up') return 'completed'
    return 'reserved'
  }

  const getFoodStatusClass = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'available') return 'available'
    if (s === 'sold_out') return 'sold_out'
    if (s === 'expired') return 'expired'
    return 'available'
  }

  if (loading) {
    return (
      <div className="rest-loading">
        <div className="rest-loading-inner">
          <div className="rest-spinner" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  const stats = dashboardStats || {}
  const restaurantName = restaurant?.restaurantName || 'Restaurant'

  const sidebar = (
    <aside className="rest-sidebar">
      <div className="rest-brand">
        <div className="rest-brand-icon">🍽</div>
        <div>
          <strong>FoodRescue</strong>
          <span>Restaurant Panel</span>
        </div>
      </div>

      <div className="rest-nav-title">Main Menu</div>

      <nav className="rest-nav">
        <button
          className={`rest-nav-item${isActive('/restaurant-dashboard') ? ' active' : ''}`}
          onClick={() => navigate('/restaurant-dashboard')}
        >
          <span className="rest-nav-icon">⌂</span>
          Dashboard
        </button>

        <button
          className={`rest-nav-item${isActive('/add-food') ? ' active' : ''}`}
          onClick={() => navigate('/add-food')}
        >
          <span className="rest-nav-icon">+</span>
          Add Food
        </button>

        <button
          className={`rest-nav-item${isActive('/my-food') ? ' active' : ''}`}
          onClick={() => navigate('/my-food')}
        >
          <span className="rest-nav-icon">▤</span>
          My Listings
        </button>

        <button
          className={`rest-nav-item${isActive('/restaurant-profile') ? ' active' : ''}`}
          onClick={() => navigate('/restaurant-profile')}
        >
          <span className="rest-nav-icon">☆</span>
          Profile
        </button>
      </nav>

      <div className="rest-sidebar-bottom">
        <div className="rest-profile">
          <div className="rest-avatar">
            {restaurantName.charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>{restaurantName}</strong>
            <span>Restaurant</span>
          </div>
        </div>

        <button className="rest-logout" onClick={handleLogout}>
          <span>↪</span>
          Logout
        </button>
      </div>
    </aside>
  )

  if (!restaurant) {
    return (
      <div className="rest-layout">
        {sidebar}
        <main className="rest-main">
          <header className="rest-topbar">
            <div>
              <h1>Restaurant Dashboard</h1>
              <p>Complete your profile to get started</p>
            </div>
          </header>

          <div className="rest-panel" style={{ maxWidth: 560 }}>
            <div className="rest-panel-header">
              <div>
                <h2>Profile Required</h2>
                <p>Create your restaurant profile to unlock all features</p>
              </div>
            </div>
            <button
              className="rest-btn-primary"
              onClick={() => navigate('/restaurant-profile')}
            >
              Create Restaurant Profile
            </button>
          </div>
        </main>
      </div>
    )
  }

  const verificationStatus = stats.verificationStatus || restaurant.verificationStatus || 'PENDING'
  const pendingPickups = reservations.filter(
    (r) => r.status === 'RESERVED' || r.status === 'READY_FOR_PICKUP'
  ).length + donatedMeals.filter(
    (m) => m.status === 'CLAIMED' || m.status === 'READY_FOR_PICKUP'
  ).length

  return (
    <div className="rest-layout">
      {sidebar}

      <main className="rest-main">
        <header className="rest-topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {restaurantName}</p>
          </div>
          <div className="rest-online">
            <span className="rest-online-dot" />
            {verificationStatus === 'VERIFIED' ? 'Verified' : verificationStatus}
          </div>
        </header>

        {message && (
          <div className="rest-message">{message}</div>
        )}

        {/* Welcome Banner */}
        <section className="rest-welcome">
          <div>
            <span className="rest-eyebrow">FoodRescue Restaurant</span>
            <h2>Manage your surplus<br />food with ease.</h2>
            <p>List, track and rescue food — all in one place.</p>
          </div>
        </section>

        {/* Stats */}
        <section className="rest-stats">
          <div className="rest-stat-card">
            <div>
              <span>Total Listings</span>
              <strong>{stats.totalFoodListings || 0}</strong>
            </div>
            <div className="rest-stat-icon orange">🍱</div>
          </div>

          <div className="rest-stat-card">
            <div>
              <span>Available</span>
              <strong>{stats.availableFoodListings || 0}</strong>
            </div>
            <div className="rest-stat-icon green">✓</div>
          </div>

          <div className="rest-stat-card">
            <div>
              <span>Reservations</span>
              <strong>{stats.totalReservations || 0}</strong>
            </div>
            <div className="rest-stat-icon amber">📋</div>
          </div>

          <div className="rest-stat-card">
            <div>
              <span>Pending Pickups</span>
              <strong>{pendingPickups}</strong>
            </div>
            <div className="rest-stat-icon red">⏳</div>
          </div>

          <div className="rest-stat-card">
            <div>
              <span>Total Quantity</span>
              <strong>{stats.totalQuantity || 0}</strong>
            </div>
            <div className="rest-stat-icon blue">📦</div>
          </div>

          <div className="rest-stat-card">
            <div>
              <span>Remaining</span>
              <strong>{stats.remainingQuantity || 0}</strong>
            </div>
            <div className="rest-stat-icon amber">🔢</div>
          </div>

          <div className="rest-stat-card">
            <div>
              <span>Reserved Qty</span>
              <strong>{stats.reservedQuantity || 0}</strong>
            </div>
            <div className="rest-stat-icon orange">🏷</div>
          </div>

          <div className="rest-stat-card">
            <div>
              <span>Total Revenue</span>
              <strong>₹{Number(stats.totalRevenue || 0).toFixed(0)}</strong>
            </div>
            <div className="rest-stat-icon green">₹</div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rest-panel" style={{ marginBottom: 20 }}>
          <div className="rest-panel-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Navigate to key sections</p>
            </div>
          </div>
          <div className="rest-actions-grid">
            <button
              className="rest-action-card"
              onClick={() => navigate('/add-food')}
            >
              <div className="rest-action-icon">+</div>
              <strong>Add Food</strong>
              <span>List surplus food</span>
            </button>

            <button
              className="rest-action-card"
              onClick={() => navigate('/my-food')}
            >
              <div className="rest-action-icon">▤</div>
              <strong>Manage Listings</strong>
              <span>Edit or delete food</span>
            </button>

            <button
              className="rest-action-card"
              onClick={() => navigate('/restaurant-profile')}
            >
              <div className="rest-action-icon">☆</div>
              <strong>View Profile</strong>
              <span>Update restaurant info</span>
            </button>
          </div>
        </section>

        {/* Pickup Management + Recent Listings */}
        <section className="rest-content-grid">

          {/* Pickup Management */}
          <div className="rest-panel">
            <div className="rest-panel-header">
              <div>
                <h2>Pickup Management</h2>
                <p>Manage customer and NGO pickups</p>
              </div>
              {pendingPickups > 0 && (
                <span className="rest-panel-badge">{pendingPickups}</span>
              )}
            </div>

            {reservations.length === 0 && donatedMeals.length === 0 ? (
              <div className="rest-empty">
                <div className="rest-empty-icon">✓</div>
                <strong>No pending pickups</strong>
                <span>All caught up!</span>
              </div>
            ) : (
              <>
                {reservations.length > 0 && (
                  <div className="rest-pickup-section">
                    <h3>Customer Pickups</h3>
                    <div className="rest-pickup-list">
                      {reservations.map((reservation) => (
                        <div className="rest-pickup-item" key={reservation.id}>
                          <div className="rest-pickup-info">
                            <h4>{reservation.foodName}</h4>
                            <p>
                              {reservation.customerName || 'Customer'} · Qty:{' '}
                              {reservation.quantity}
                            </p>
                            <p>{reservation.fulfillmentType}</p>
                          </div>
                          <div className="rest-pickup-actions">
                            <span
                              className={`rest-status-badge ${getStatusClass(reservation.status)}`}
                            >
                              {reservation.status}
                            </span>

                            {reservation.status === 'RESERVED' && (
                              <button
                                className="rest-btn-primary"
                                onClick={() =>
                                  markReservationReady(reservation.id)
                                }
                              >
                                Mark Ready
                              </button>
                            )}

                            {reservation.status === 'READY_FOR_PICKUP' && (
                              <div className="rest-otp-row">
                                <input
                                  className="rest-otp-input"
                                  type="text"
                                  maxLength="6"
                                  placeholder="OTP"
                                  value={
                                    otpValues[`reservation-${reservation.id}`] || ''
                                  }
                                  onChange={(e) =>
                                    setOtpValues((current) => ({
                                      ...current,
                                      [`reservation-${reservation.id}`]:
                                        e.target.value.replace(/\D/g, '')
                                    }))
                                  }
                                />
                                <button
                                  className="rest-btn-primary"
                                  onClick={() =>
                                    verifyReservationOtp(reservation.id)
                                  }
                                >
                                  Verify
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {donatedMeals.length > 0 && (
                  <div className="rest-pickup-section">
                    <h3>NGO Pickups</h3>
                    <div className="rest-pickup-list">
                      {donatedMeals.map((meal) => (
                        <div className="rest-pickup-item" key={meal.id}>
                          <div className="rest-pickup-info">
                            <h4>{meal.foodName}</h4>
                            <p>Qty: {meal.quantity} · NGO Donation</p>
                          </div>
                          <div className="rest-pickup-actions">
                            <span
                              className={`rest-status-badge ${getStatusClass(meal.status)}`}
                            >
                              {meal.status}
                            </span>

                            {meal.status === 'CLAIMED' && (
                              <button
                                className="rest-btn-primary"
                                onClick={() => markDonatedMealReady(meal.id)}
                              >
                                Mark Ready
                              </button>
                            )}

                            {meal.status === 'READY_FOR_PICKUP' && (
                              <div className="rest-otp-row">
                                <input
                                  className="rest-otp-input"
                                  type="text"
                                  maxLength="6"
                                  placeholder="OTP"
                                  value={otpValues[`meal-${meal.id}`] || ''}
                                  onChange={(e) =>
                                    setOtpValues((current) => ({
                                      ...current,
                                      [`meal-${meal.id}`]: e.target.value.replace(
                                        /\D/g,
                                        ''
                                      )
                                    }))
                                  }
                                />
                                <button
                                  className="rest-btn-primary"
                                  onClick={() => verifyDonatedMealOtp(meal.id)}
                                >
                                  Verify
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Recent Food Listings */}
          <div className="rest-panel">
            <div className="rest-panel-header">
              <div>
                <h2>Recent Listings</h2>
                <p>Total quantity: {stats.totalQuantity || 0}</p>
              </div>
              <button
                className="rest-btn-secondary"
                onClick={() => navigate('/my-food')}
              >
                View All
              </button>
            </div>

            {foodItems.length === 0 ? (
              <div className="rest-empty">
                <div className="rest-empty-icon">+</div>
                <strong>No food listings yet</strong>
                <span>Add your first food item to get started</span>
              </div>
            ) : (
              <div className="rest-food-list">
                {foodItems.slice(0, 6).map((food) => (
                  <div className="rest-food-row" key={food.id}>
                    <div className="rest-food-row-info">
                      <h4>{food.foodName}</h4>
                      <p>
                        Remaining: {food.remainingQuantity} / {food.quantity} · ₹
                        {food.rescuePrice}
                      </p>
                    </div>
                    <span
                      className={`rest-food-status ${getFoodStatusClass(food.status)}`}
                    >
                      {food.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default RestaurantDashboard