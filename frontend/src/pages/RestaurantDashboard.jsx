import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../utils/api'

function RestaurantDashboard() {
  const navigate = useNavigate()

  const [restaurant, setRestaurant] = useState(null)
  const [foodItems, setFoodItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setMessage('')

      const profileResponse = await apiFetch(
        '/api/restaurants/my-profile'
      )

      if (profileResponse.status === 404) {
        setRestaurant(null)
        setFoodItems([])
        return
      }

      const profileData = await profileResponse.json()

      if (!profileResponse.ok) {
        throw new Error('Failed to load restaurant profile')
      }

      setRestaurant(profileData)

      const foodResponse = await apiFetch(
        `/api/food/restaurant/${profileData.id}`
      )

      if (!foodResponse.ok) {
        throw new Error('Failed to load food listings')
      }

      const foodData = await foodResponse.json()
      setFoodItems(foodData)
    } catch (error) {
      setMessage(
        error.message || 'Unable to load dashboard'
      )
    } finally {
      setLoading(false)
    }
  }

  const totalListings = foodItems.length

  const availableListings = foodItems.filter(
    (food) => food.status === 'AVAILABLE'
  ).length

  const soldOutListings = foodItems.filter(
    (food) => food.status === 'SOLD_OUT'
  ).length

  const totalQuantity = foodItems.reduce(
    (total, food) =>
      total + Number(food.quantity || 0),
    0
  )

  const remainingQuantity = foodItems.reduce(
    (total, food) =>
      total + Number(food.remainingQuantity || 0),
    0
  )

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Restaurant Dashboard</h1>
          <p>Loading your restaurant dashboard...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Restaurant Dashboard</h1>
          <p>
            Create your restaurant profile to get started.
          </p>
        </div>

        <div className="dashboard-card">
          <h2>Restaurant Profile Required</h2>

          <p>
            You need to create your restaurant profile before
            adding food listings.
          </p>

          <button
            className="auth-btn"
            onClick={() => navigate('/restaurant-profile')}
          >
            Create Restaurant Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Restaurant Dashboard</h1>

        <p>
          Welcome, {restaurant.restaurantName}
        </p>
      </div>

      {message && (
        <div className="dashboard-card">
          <p>{message}</p>
        </div>
      )}

      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <h3>Total Listings</h3>
          <strong>{totalListings}</strong>
        </div>

        <div className="dashboard-stat-card">
          <h3>Available</h3>
          <strong>{availableListings}</strong>
        </div>

        <div className="dashboard-stat-card">
          <h3>Sold Out</h3>
          <strong>{soldOutListings}</strong>
        </div>

        <div className="dashboard-stat-card">
          <h3>Food Remaining</h3>
          <strong>{remainingQuantity}</strong>
        </div>
      </div>

      <div className="dashboard-card">
        <h2>Quick Actions</h2>

        <div className="dashboard-actions">
          <button
            className="auth-btn"
            onClick={() => navigate('/add-food')}
          >
            Add Food
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate('/my-food')}
          >
            Manage My Food
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate('/restaurant-profile')}
          >
            View Profile
          </button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-section-header">
          <div>
            <h2>Recent Food Listings</h2>
            <p>
              Total food quantity listed: {totalQuantity}
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => navigate('/my-food')}
          >
            View All
          </button>
        </div>

        {foodItems.length === 0 ? (
          <div className="empty-dashboard">
            <h3>No Food Listings Yet</h3>

            <p>
              Start rescuing surplus food by adding your
              first food listing.
            </p>

            <button
              className="auth-btn"
              onClick={() => navigate('/add-food')}
            >
              Add Your First Food
            </button>
          </div>
        ) : (
          <div className="food-listings">
            {foodItems.slice(0, 5).map((food) => (
              <div
                className="food-listing-item"
                key={food.id}
              >
                <div>
                  <h3>{food.foodName}</h3>

                  <p>
                    Remaining: {food.remainingQuantity} /{' '}
                    {food.quantity}
                  </p>
                </div>

                <div>
                  <p>
                    Rescue Price: ₹{food.rescuePrice}
                  </p>

                  <p>
                    Status: {food.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantDashboard