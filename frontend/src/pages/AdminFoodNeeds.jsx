import { useEffect, useState } from 'react'
import { apiFetch } from '../utils/api'

function AdminFoodNeeds() {
  const [foodNeeds, setFoodNeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadFoodNeeds = async () => {
    try {
      setLoading(true)
      setMessage('')

      const response = await apiFetch(
        '/api/admin/food-needs'
      )

      if (!response.ok) {
        throw new Error(
          await response.text()
        )
      }

      const data = await response.json()

      setFoodNeeds(data)

    } catch (error) {
      console.error(error)
      setMessage(
        error.message ||
        'Unable to load food needs'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFoodNeeds()
  }, [])

  const getRemainingQuantity = need => {
    return Math.max(
      0,
      (need.quantityNeeded || 0) -
      (need.quantityFulfilled || 0)
    )
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <h1>Food Need Monitoring</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        <h1>Food Need Monitoring</h1>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        <div className="dashboard-stats">

          <div className="stat-card">
            <span>Total Food Needs</span>
            <strong>
              {foodNeeds.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Open</span>
            <strong>
              {
                foodNeeds.filter(
                  need => need.status === 'OPEN'
                ).length
              }
            </strong>
          </div>

          <div className="stat-card">
            <span>Partially Fulfilled</span>
            <strong>
              {
                foodNeeds.filter(
                  need =>
                    need.status ===
                    'PARTIALLY_FULFILLED'
                ).length
              }
            </strong>
          </div>

          <div className="stat-card">
            <span>Fulfilled</span>
            <strong>
              {
                foodNeeds.filter(
                  need =>
                    need.status === 'FULFILLED'
                ).length
              }
            </strong>
          </div>

        </div>

        <section className="dashboard-section">

          <h2>All Food Needs</h2>

          {foodNeeds.length === 0 ? (
            <p>
              No food needs found.
            </p>
          ) : (
            <div className="admin-list">

              {foodNeeds.map(need => (
                <div
                  className="admin-list-item"
                  key={need.id}
                >

                  <div>

                    <h3>
                      {need.foodType}
                    </h3>

                    <p>
                      NGO ID: {need.ngoId}
                    </p>

                    <p>
                      Quantity Needed: {
                        need.quantityNeeded
                      }
                    </p>

                    <p>
                      Quantity Fulfilled: {
                        need.quantityFulfilled || 0
                      }
                    </p>

                    <p>
                      Remaining: {
                        getRemainingQuantity(need)
                      }
                    </p>

                    <p>
                      Location: {
                        need.location ||
                        'Not provided'
                      }
                    </p>

                    <p>
                      Needed By: {
                        need.neededBy ||
                        'Not provided'
                      }
                    </p>

                    <p>
                      Urgency: {
                        need.urgency ||
                        'Not provided'
                      }
                    </p>

                    <p>
                      Allow Purchase: {
                        need.allowPurchase
                          ? 'Yes'
                          : 'No'
                      }
                    </p>

                    <p>
                      Created At: {
                        need.createdAt ||
                        'Not provided'
                      }
                    </p>

                    <span>
                      Status: {need.status}
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

export default AdminFoodNeeds