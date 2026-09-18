import { useEffect, useState } from 'react'
import { apiFetch } from '../utils/api'

function NGODashboard() {
  const [profile, setProfile] = useState(null)
  const [availableMeals, setAvailableMeals] = useState([])
  const [claimedMeals, setClaimedMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadDashboard = async () => {
    try {
      setLoading(true)

      const profileResponse = await apiFetch(
        '/api/ngos/my-profile'
      )

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfile(profileData)
      }

      const availableResponse = await apiFetch(
        '/api/donated-meals/available'
      )

      if (availableResponse.ok) {
        const availableData =
          await availableResponse.json()

        setAvailableMeals(availableData)
      }

      const claimedResponse = await apiFetch(
        '/api/donated-meals/my-claimed'
      )

      if (claimedResponse.ok) {
        const claimedData =
          await claimedResponse.json()

        setClaimedMeals(claimedData)
      }
    } catch (error) {
      console.error(error)
      setMessage('Unable to load NGO dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const claimMeal = async (mealId) => {
    try {
      setMessage('')

      const response = await apiFetch(
        `/api/donated-meals/${mealId}/claim`,
        {
          method: 'PUT'
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(data || 'Unable to claim meal')
        return
      }

      setMessage('Meal claimed successfully')
      await loadDashboard()
    } catch (error) {
      console.error(error)
      setMessage('Unable to claim meal')
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <h1>NGO Dashboard</h1>
        <p>Loading...</p>
      </div>
    )
  }

  const isVerified =
    profile?.verificationStatus === 'VERIFIED'

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>NGO Dashboard</h1>
          <p>
            Manage donated meals and your claimed meals.
          </p>
        </div>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {!profile ? (
        <div className="dashboard-card">
          <h2>NGO Profile Required</h2>
          <p>
            Please create your NGO profile before claiming
            donated meals.
          </p>
        </div>
      ) : (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <span>Verification</span>
              <strong>
                {profile.verificationStatus || 'PENDING'}
              </strong>
            </div>

            <div className="stat-card">
              <span>Available Meals</span>
              <strong>{availableMeals.length}</strong>
            </div>

            <div className="stat-card">
              <span>My Claimed Meals</span>
              <strong>{claimedMeals.length}</strong>
            </div>
          </div>

          <section className="dashboard-section">
            <div className="section-header">
              <div>
                <h2>Available Donated Meals</h2>
                <p>
                  Meals available for verified NGOs to claim.
                </p>
              </div>
            </div>

            {!isVerified && (
              <div className="dashboard-card">
                <p>
                  Your NGO must be verified before you can
                  claim donated meals.
                </p>
              </div>
            )}

            {availableMeals.length === 0 ? (
              <div className="dashboard-card">
                <p>
                  No donated meals are currently available.
                </p>
              </div>
            ) : (
              <div className="ngo-meal-grid">
                {availableMeals.map((meal) => (
                  <div
                    className="ngo-meal-card"
                    key={meal.id}
                  >
                    <div className="ngo-meal-top">
                      <div>
                        <h3>{meal.foodName}</h3>
                        <p>
                          {meal.restaurantName}
                        </p>
                      </div>

                      <span className="food-status">
                        AVAILABLE
                      </span>
                    </div>

                    <div className="ngo-meal-details">
                      <div>
                        <span>Quantity</span>
                        <strong>
                          {meal.quantity}
                        </strong>
                      </div>

                      <div>
                        <span>Pickup</span>
                        <strong>
                          {meal.pickupDeadline}
                        </strong>
                      </div>
                    </div>

                    {meal.allergens && (
                      <div className="ngo-meal-allergens">
                        <span>Allergens</span>
                        <strong>
                          {meal.allergens}
                        </strong>
                      </div>
                    )}

                    <button
                      className="add-food-btn"
                      onClick={() =>
                        claimMeal(meal.id)
                      }
                      disabled={!isVerified}
                    >
                      Claim Meal
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="dashboard-section">
  <div className="section-header">
    <div>
      <h2>My Claimed Meals</h2>
      <p>
        Donated meals already claimed by your NGO.
      </p>
    </div>
  </div>

  {claimedMeals.length === 0 ? (
    <div className="dashboard-card">
      <p>
        You have not claimed any meals yet.
      </p>
    </div>
  ) : (
    <div className="ngo-meal-grid">
      {claimedMeals.map((meal) => (
        <div
          className="ngo-meal-card"
          key={meal.id}
        >
          <div className="ngo-meal-top">
            <div>
              <h3>{meal.foodName}</h3>
              <p>{meal.restaurantName}</p>
            </div>

            <span className="food-status">
              {meal.status}
            </span>
          </div>

          <div className="ngo-meal-details">
            <div>
              <span>Quantity</span>
              <strong>
                {meal.quantity}
              </strong>
            </div>

            <div>
              <span>Pickup</span>
              <strong>
                {meal.pickupDeadline || 'Not provided'}
              </strong>
            </div>
          </div>

          {meal.allergens && (
            <div className="ngo-meal-allergens">
              <span>Allergens</span>
              <strong>
                {meal.allergens}
              </strong>
            </div>
          )}
          {meal.status === 'READY_FOR_PICKUP' &&
  meal.pickupOtp && (
    <div className="pickup-otp-card">
      <span>Pickup OTP</span>

      <strong>
        {meal.pickupOtp}
      </strong>

      <p>
        Show this OTP to the restaurant during pickup.
      </p>
    </div>
  )}
        </div>
      ))}
      
    </div>
  )}
  
</section>
        </>
      )}
    </div>
  )
}

export default NGODashboard