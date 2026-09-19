import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../../../utils/api'

function MyFood() {
  const navigate = useNavigate()

  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadFoods = async () => {
    try {
      setLoading(true)
      setMessage('')

      const profileResponse = await apiFetch(
        '/api/restaurants/my-profile'
      )

      if (profileResponse.status === 404) {
        throw new Error(
          'Restaurant profile not found. Please create your profile first.'
        )
      }

      if (!profileResponse.ok) {
        throw new Error('Failed to load restaurant profile')
      }

      const profile = await profileResponse.json()

      const response = await apiFetch(
        `/api/food/restaurant/${profile.id}`
      )

      if (!response.ok) {
        throw new Error('Failed to load food listings')
      }

      const data = await response.json()
      setFoods(data)
    } catch (error) {
      setMessage(
        error.message || 'Unable to load food listings'
      )
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

    if (!confirmed) {
      return
    }

    try {
      const response = await apiFetch(
        `/api/food/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        const text = await response.text()

        throw new Error(
          text || 'Failed to delete listing'
        )
      }

      setFoods((currentFoods) =>
        currentFoods.filter(
          (food) => food.id !== id
        )
      )

      setMessage(
        'Food listing deleted successfully'
      )
    } catch (error) {
      setMessage(
        error.message || 'Unable to delete listing'
      )
    }
  }

  const formatPickupTime = (value) => {
    if (!value) {
      return 'Not specified'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  const getStatusClass = (status) => {
    if (status === 'AVAILABLE') {
      return 'status-available'
    }

    if (status === 'SOLD_OUT') {
      return 'status-sold'
    }

    if (status === 'EXPIRED') {
      return 'status-expired'
    }

    return 'status-default'
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>My Food Listings</h1>
          <p>Loading your food listings...</p>
        </div>

        <div className="dashboard-card">
          <div className="food-loading">
            Loading listings...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>My Food Listings</h1>
          <p>
            Manage your restaurant's surplus food.
          </p>
        </div>
      </div>

      <div className="my-food-container">
        <div className="my-food-topbar">
          <div>
            <h2>Your Listings</h2>
            <p>
              {foods.length} listing
              {foods.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <button
            className="add-food-btn"
            onClick={() => navigate('/add-food')}
          >
            + Add New Food
          </button>
        </div>

        {message && (
          <div className="my-food-message">
            {message}
          </div>
        )}

        {foods.length === 0 ? (
          <div className="my-food-empty">
            <div className="empty-icon">+</div>

            <h3>No Food Listings Yet</h3>

            <p>
              Start listing your surplus food and help
              reduce food waste.
            </p>

            <button
              className="add-food-btn"
              onClick={() => navigate('/add-food')}
            >
              Add Your First Food
            </button>
          </div>
        ) : (
          <div className="my-food-grid">
            {foods.map((food) => (
              <div
                className="my-food-card"
                key={food.id}
              >
                <div className="my-food-card-header">
                  <div>
                    <h3>{food.foodName}</h3>

                    <span
                      className={`food-status ${getStatusClass(
                        food.status
                      )}`}
                    >
                      {food.status || 'UNKNOWN'}
                    </span>
                  </div>
                </div>

                <p className="my-food-description">
                  {food.description}
                </p>

                <div className="food-quantity-box">
                  <div>
                    <span>Total Quantity</span>
                    <strong>{food.quantity}</strong>
                  </div>

                  <div>
                    <span>Remaining</span>
                    <strong>
                      {food.remainingQuantity}
                    </strong>
                  </div>
                </div>

                <div className="food-price-row">
                  <div>
                    <span>Original Price</span>
                    <strong>
                      ₹{food.originalPrice}
                    </strong>
                  </div>

                  <div className="rescue-price">
                    <span>Rescue Price</span>
                    <strong>
                      ₹{food.rescuePrice}
                    </strong>
                  </div>
                </div>

                <div className="food-details">
                  <div className="food-detail">
                    <span>Allergens</span>
                    <strong>
                      {food.allergens || 'None'}
                    </strong>
                  </div>

                  <div className="food-detail">
                    <span>Pickup</span>
                    <strong>
                      {formatPickupTime(
                        food.pickupDeadline
                      )}
                    </strong>
                  </div>
                </div>

                <div className="my-food-actions">
                  <button
                    className="edit-food-btn"
                    onClick={() =>
                      navigate(
                        `/edit-food/${food.id}`
                      )
                    }
                  >
                    Edit Listing
                  </button>

                  <button
                    className="delete-food-btn"
                    onClick={() =>
                      handleDelete(food.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyFood
