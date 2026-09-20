import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiFetch, logoutUser } from '../../../utils/api'
import '../../../styles/restaurant.css'

function RestaurantSidebar({ restaurantName, navigate, location, handleLogout }) {
  const isActive = (path) => location.pathname === path

  return (
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
            {(restaurantName || 'R').charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>{restaurantName || 'Restaurant'}</strong>
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
}

function MyFood() {
  const navigate = useNavigate()
  const location = useLocation()

  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [restaurantName, setRestaurantName] = useState('')

  const loadFoods = async () => {
    try {
      setLoading(true)
      setMessage('')

      const profileResponse = await apiFetch('/api/restaurants/my-profile')

      if (profileResponse.status === 404) {
        throw new Error(
          'Restaurant profile not found. Please create your profile first.'
        )
      }

      if (!profileResponse.ok) {
        throw new Error('Failed to load restaurant profile')
      }

      const profile = await profileResponse.json()
      setRestaurantName(profile.restaurantName || '')

      const response = await apiFetch(`/api/food/restaurant/${profile.id}`)

      if (!response.ok) {
        throw new Error('Failed to load food listings')
      }

      const data = await response.json()
      setFoods(data)
    } catch (error) {
      setMessage(error.message || 'Unable to load food listings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFoods()
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this food listing?'
    )
    if (!confirmed) return

    try {
      const response = await apiFetch(`/api/food/${id}`, { method: 'DELETE' })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Failed to delete listing')
      }

      setFoods((currentFoods) =>
        currentFoods.filter((food) => food.id !== id)
      )
      setMessage('Food listing deleted successfully')
    } catch (error) {
      setMessage(error.message || 'Unable to delete listing')
    }
  }

  const formatPickupTime = (value) => {
    if (!value) return 'Not specified'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  const getFoodStatusClass = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'available') return 'available'
    if (s === 'sold_out') return 'sold_out'
    if (s === 'expired') return 'expired'
    return 'available'
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="rest-loading">
        <div className="rest-loading-inner">
          <div className="rest-spinner" />
          <span>Loading listings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rest-layout">
      <RestaurantSidebar
        restaurantName={restaurantName}
        navigate={navigate}
        location={location}
        handleLogout={handleLogout}
      />

      <main className="rest-main">
        <header className="rest-topbar">
          <div>
            <h1>My Listings</h1>
            <p>Manage your restaurant's surplus food</p>
          </div>
          <button
            className="rest-btn-primary"
            onClick={() => navigate('/add-food')}
          >
            + Add New Food
          </button>
        </header>

        {message && <div className="rest-message">{message}</div>}

        <div className="rest-food-topbar">
          <div>
            <h2>Your Listings</h2>
            <p>
              {foods.length} listing{foods.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        {foods.length === 0 ? (
          <div className="rest-panel">
            <div className="rest-empty" style={{ minHeight: 220 }}>
              <div className="rest-empty-icon" style={{ width: 52, height: 52, fontSize: 22 }}>+</div>
              <strong style={{ fontSize: 16, marginBottom: 8 }}>No Food Listings Yet</strong>
              <span style={{ fontSize: 13, maxWidth: 320, textAlign: 'center', lineHeight: 1.6 }}>
                Start listing your surplus food and help reduce food waste.
              </span>
              <button
                className="rest-btn-primary"
                style={{ marginTop: 20, padding: '12px 24px', fontSize: 14 }}
                onClick={() => navigate('/add-food')}
              >
                Add Your First Food
              </button>
            </div>
          </div>
        ) : (
          <div className="rest-food-grid">
            {foods.map((food) => (
              <div className="rest-food-card" key={food.id}>
                <div className="rest-food-card-header">
                  <h3>{food.foodName}</h3>
                  <span className={`rest-food-status ${getFoodStatusClass(food.status)}`}>
                    {food.status || 'UNKNOWN'}
                  </span>
                </div>

                <p className="rest-food-description">{food.description}</p>

                <div className="rest-qty-row">
                  <div>
                    <span>Total Quantity</span>
                    <strong>{food.quantity}</strong>
                  </div>
                  <div>
                    <span>Remaining</span>
                    <strong>{food.remainingQuantity}</strong>
                  </div>
                </div>

                <div className="rest-price-row">
                  <div>
                    <span>Original Price</span>
                    <strong>₹{food.originalPrice}</strong>
                  </div>
                  <div className="rest-rescue-price">
                    <span>Rescue Price</span>
                    <strong>₹{food.rescuePrice}</strong>
                  </div>
                </div>

                <div className="rest-details-section">
                  <div className="rest-detail-row">
                    <span>Allergens</span>
                    <strong>{food.allergens || 'None'}</strong>
                  </div>
                  <div className="rest-detail-row">
                    <span>Pickup</span>
                    <strong>{formatPickupTime(food.pickupDeadline)}</strong>
                  </div>
                </div>

                <div className="rest-food-actions">
                  <button
                    className="rest-edit-btn"
                    onClick={() => navigate(`/edit-food/${food.id}`)}
                  >
                    Edit Listing
                  </button>
                  <button
                    className="rest-delete-btn"
                    onClick={() => handleDelete(food.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default MyFood
