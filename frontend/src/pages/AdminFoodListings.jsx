import { useEffect, useState } from 'react'
import { apiFetch } from '../utils/api'

function AdminFoodListings() {
  const [foodListings, setFoodListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadFoodListings = async () => {
    try {
      setLoading(true)
      setMessage('')

      const response = await apiFetch(
        '/api/admin/food-listings'
      )

      if (!response.ok) {
        throw new Error(
          await response.text()
        )
      }

      const data = await response.json()

      setFoodListings(data)

    } catch (error) {
      console.error(error)
      setMessage(
        error.message ||
        'Unable to load food listings'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFoodListings()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-page admin-dashboard">
        <div className="dashboard-container">
          <h1>Food Listings Monitoring</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page admin-dashboard">
      <div className="dashboard-container">

        <h1>Food Listings Monitoring</h1>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        <div className="dashboard-stats">

          <div className="stat-card">
            <span>Total Listings</span>
            <strong>
              {foodListings.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Available</span>
            <strong>
              {
                foodListings.filter(
                  food =>
                    food.status === 'AVAILABLE'
                ).length
              }
            </strong>
          </div>

          <div className="stat-card">
            <span>Sold Out</span>
            <strong>
              {
                foodListings.filter(
                  food =>
                    food.status === 'SOLD_OUT'
                ).length
              }
            </strong>
          </div>

          <div className="stat-card">
            <span>Expired</span>
            <strong>
              {
                foodListings.filter(
                  food =>
                    food.status === 'EXPIRED'
                ).length
              }
            </strong>
          </div>

        </div>

        <section className="dashboard-section">

          <h2>All Food Listings</h2>

          {foodListings.length === 0 ? (
            <p>
              No food listings found.
            </p>
          ) : (
            <div className="admin-list">

              {foodListings.map(food => (
                <div
                  className="admin-list-item"
                  key={food.id}
                >

                  <div>

                    <h3>
                      {food.foodName}
                    </h3>

                    <p>
                      Restaurant: {
                        food.restaurantName ||
                        'Not provided'
                      }
                    </p>

                    <p>
                      Quantity: {food.quantity}
                      {' · '}
                      Remaining: {
                        food.remainingQuantity
                      }
                    </p>

                    <p>
                      Original Price: ₹{
                        food.originalPrice
                      }
                    </p>

                    <p>
                      Rescue Price: ₹{
                        food.rescuePrice
                      }
                    </p>

                    <p>
                      Pickup: {
                        food.pickupDeadline ||
                        'Not provided'
                      }
                    </p>

                    {food.allergens && (
                      <p>
                        Allergens: {food.allergens}
                      </p>
                    )}

                    <span>
                      Status: {food.status}
                    </span>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </div>
  )
}

export default AdminFoodListings