import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../../../utils/api'

function RestaurantDashboard() {
  const navigate = useNavigate()

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

      const profileResponse = await apiFetch(
        '/api/restaurants/my-profile'
      )

      if (profileResponse.status === 404) {
        setRestaurant(null)
        setDashboardStats(null)
        setFoodItems([])
        setReservations([])
        setDonatedMeals([])
        return
      }

      const profileData =
        await profileResponse.json()

      if (!profileResponse.ok) {
        throw new Error(
          'Failed to load restaurant profile'
        )
      }

      setRestaurant(profileData)

      const dashboardResponse = await apiFetch(
        '/api/restaurants/dashboard'
      )

      if (!dashboardResponse.ok) {
        throw new Error(
          'Failed to load dashboard statistics'
        )
      }

      const dashboardData =
        await dashboardResponse.json()

      setDashboardStats(dashboardData)

      const foodResponse = await apiFetch(
        `/api/food/restaurant/${profileData.id}`
      )

      if (!foodResponse.ok) {
        throw new Error(
          'Failed to load food listings'
        )
      }

      const foodData =
        await foodResponse.json()

      setFoodItems(foodData)

      const reservationResponse =
        await apiFetch(
          `/api/reservations/restaurant/${profileData.id}`
        )

      if (reservationResponse.ok) {
        const reservationData =
          await reservationResponse.json()

        setReservations(reservationData)
      } else {
        setReservations([])
      }

      const donatedResponse =
        await apiFetch(
          `/api/donated-meals/restaurant/${profileData.id}`
        )

      if (donatedResponse.ok) {
        const donatedData =
          await donatedResponse.json()

        setDonatedMeals(donatedData)
      } else {
        setDonatedMeals([])
      }
    } catch (error) {
      setMessage(
        error.message ||
          'Unable to load dashboard'
      )
    } finally {
      setLoading(false)
    }
  }

  const markReservationReady = async (
    reservationId
  ) => {
    try {
      setMessage('')

      const response = await apiFetch(
        `/api/reservations/${reservationId}/ready`,
        {
          method: 'PUT'
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(
          data ||
            'Unable to mark reservation ready'
        )
        return
      }

      setMessage(
        'Reservation is ready for pickup'
      )

      await loadDashboard()
    } catch {
      setMessage(
        'Unable to mark reservation ready'
      )
    }
  }

  const markDonatedMealReady = async (
    mealId
  ) => {
    try {
      setMessage('')

      const response = await apiFetch(
        `/api/donated-meals/${mealId}/ready`,
        {
          method: 'PUT'
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(
          data ||
            'Unable to mark donated meal ready'
        )
        return
      }

      setMessage(
        'Donated meal is ready for pickup'
      )

      await loadDashboard()
    } catch {
      setMessage(
        'Unable to mark donated meal ready'
      )
    }
  }

  const verifyReservationOtp = async (
    reservationId
  ) => {
    try {
      setMessage('')

      const otp =
        otpValues[
          `reservation-${reservationId}`
        ]

      if (!otp || otp.length !== 6) {
        setMessage(
          'Please enter the 6-digit OTP'
        )
        return
      }

      const response = await apiFetch(
        `/api/reservations/${reservationId}/verify-otp`,
        {
          method: 'PUT',
          body: JSON.stringify(otp)
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(
          data ||
            'Unable to verify pickup OTP'
        )
        return
      }

      setMessage(
        'Customer pickup verified successfully'
      )

      setOtpValues((current) => {
        const updated = { ...current }

        delete updated[
          `reservation-${reservationId}`
        ]

        return updated
      })

      await loadDashboard()
    } catch {
      setMessage(
        'Unable to verify pickup OTP'
      )
    }
  }

  const verifyDonatedMealOtp = async (
    mealId
  ) => {
    try {
      setMessage('')

      const otp =
        otpValues[`meal-${mealId}`]

      if (!otp || otp.length !== 6) {
        setMessage(
          'Please enter the 6-digit OTP'
        )
        return
      }

      const response = await apiFetch(
        `/api/donated-meals/${mealId}/verify-otp`,
        {
          method: 'PUT',
          body: JSON.stringify(otp)
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(
          data ||
            'Unable to verify pickup OTP'
        )
        return
      }

      setMessage(
        'NGO pickup verified successfully'
      )

      setOtpValues((current) => {
        const updated = { ...current }

        delete updated[`meal-${mealId}`]

        return updated
      })

      await loadDashboard()
    } catch {
      setMessage(
        'Unable to verify pickup OTP'
      )
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Restaurant Dashboard</h1>

          <p>
            Loading your restaurant dashboard...
          </p>
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
            Create your restaurant profile
            to get started.
          </p>
        </div>

        <div className="dashboard-card">
          <h2>
            Restaurant Profile Required
          </h2>

          <p>
            You need to create your restaurant
            profile before adding food listings.
          </p>

          <button
            className="auth-btn"
            onClick={() =>
              navigate('/restaurant-profile')
            }
          >
            Create Restaurant Profile
          </button>
        </div>
      </div>
    )
  }

  const stats = dashboardStats || {}

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

          <strong>
            {stats.totalFoodListings || 0}
          </strong>
        </div>

        <div className="dashboard-stat-card">
          <h3>Available</h3>

          <strong>
            {stats.availableFoodListings || 0}
          </strong>
        </div>

        <div className="dashboard-stat-card">
          <h3>Total Quantity</h3>

          <strong>
            {stats.totalQuantity || 0}
          </strong>
        </div>

        <div className="dashboard-stat-card">
          <h3>Food Remaining</h3>

          <strong>
            {stats.remainingQuantity || 0}
          </strong>
        </div>

        <div className="dashboard-stat-card">
          <h3>Reservations</h3>

          <strong>
            {stats.totalReservations || 0}
          </strong>
        </div>

        <div className="dashboard-stat-card">
          <h3>Reserved Quantity</h3>

          <strong>
            {stats.reservedQuantity || 0}
          </strong>
        </div>

        <div className="dashboard-stat-card">
          <h3>Total Revenue</h3>

          <strong>
            ₹{Number(
              stats.totalRevenue || 0
            ).toFixed(2)}
          </strong>
        </div>

        <div className="dashboard-stat-card">
          <h3>Verification</h3>

          <strong>
            {stats.verificationStatus ||
              restaurant.verificationStatus ||
              'PENDING'}
          </strong>
        </div>
      </div>

      <div className="dashboard-card">
        <h2>Quick Actions</h2>

        <div className="dashboard-actions">
          <button
            className="auth-btn"
            onClick={() =>
              navigate('/add-food')
            }
          >
            Add Food
          </button>

          <button
            className="secondary-btn"
            onClick={() =>
              navigate('/my-food')
            }
          >
            Manage My Food
          </button>

          <button
            className="secondary-btn"
            onClick={() =>
              navigate('/restaurant-profile')
            }
          >
            View Profile
          </button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-section-header">
          <div>
            <h2>Pickup Management</h2>

            <p>
              Prepare orders and verify customer
              or NGO pickups.
            </p>
          </div>
        </div>

        {reservations.length === 0 &&
        donatedMeals.length === 0 ? (
          <div className="empty-dashboard">
            <h3>No Pending Pickups</h3>

            <p>
              Customer and NGO pickups will
              appear here.
            </p>
          </div>
        ) : (
          <>
            {reservations.length > 0 && (
              <div className="pickup-section">
                <h3>Customer Pickups</h3>

                <div className="food-listings">
                  {reservations.map(
                    (reservation) => (
                      <div
                        className="food-listing-item"
                        key={reservation.id}
                      >
                        <div>
                          <h3>
                            {reservation.foodName}
                          </h3>

                          <p>
                            Customer:{' '}
                            {reservation.customerName ||
                              'Customer'}
                          </p>

                          <p>
                            Quantity:{' '}
                            {reservation.quantity}
                          </p>

                          <p>
                            Fulfillment:{' '}
                            {reservation.fulfillmentType}
                          </p>
                        </div>

                        <div>
                          <p>
                            Status:{' '}
                            {reservation.status}
                          </p>

                          {reservation.status ===
                            'RESERVED' && (
                            <button
                              className="auth-btn"
                              onClick={() =>
                                markReservationReady(
                                  reservation.id
                                )
                              }
                            >
                              Mark Ready
                            </button>
                          )}

                          {reservation.status ===
                            'READY_FOR_PICKUP' && (
                            <div className="pickup-verification">
                              <input
                                type="text"
                                maxLength="6"
                                placeholder="Enter OTP"
                                value={
                                  otpValues[
                                    `reservation-${reservation.id}`
                                  ] || ''
                                }
                                onChange={(event) =>
                                  setOtpValues(
                                    (current) => ({
                                      ...current,
                                      [`reservation-${reservation.id}`]:
                                        event.target.value.replace(
                                          /\D/g,
                                          ''
                                        )
                                    })
                                  )
                                }
                              />

                              <button
                                className="auth-btn"
                                onClick={() =>
                                  verifyReservationOtp(
                                    reservation.id
                                  )
                                }
                              >
                                Verify Pickup
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {donatedMeals.length > 0 && (
              <div className="pickup-section">
                <h3>NGO Pickups</h3>

                <div className="food-listings">
                  {donatedMeals.map(
                    (meal) => (
                      <div
                        className="food-listing-item"
                        key={meal.id}
                      >
                        <div>
                          <h3>
                            {meal.foodName}
                          </h3>

                          <p>
                            Quantity:{' '}
                            {meal.quantity}
                          </p>

                          <p>
                            NGO pickup
                          </p>
                        </div>

                        <div>
                          <p>
                            Status:{' '}
                            {meal.status}
                          </p>

                          {meal.status ===
                            'CLAIMED' && (
                            <button
                              className="auth-btn"
                              onClick={() =>
                                markDonatedMealReady(
                                  meal.id
                                )
                              }
                            >
                              Mark Ready
                            </button>
                          )}

                          {meal.status ===
                            'READY_FOR_PICKUP' && (
                            <div className="pickup-verification">
                              <input
                                type="text"
                                maxLength="6"
                                placeholder="Enter OTP"
                                value={
                                  otpValues[
                                    `meal-${meal.id}`
                                  ] || ''
                                }
                                onChange={(event) =>
                                  setOtpValues(
                                    (current) => ({
                                      ...current,
                                      [`meal-${meal.id}`]:
                                        event.target.value.replace(
                                          /\D/g,
                                          ''
                                        )
                                    })
                                  )
                                }
                              />

                              <button
                                className="auth-btn"
                                onClick={() =>
                                  verifyDonatedMealOtp(
                                    meal.id
                                  )
                                }
                              >
                                Verify Pickup
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="dashboard-card">
        <div className="dashboard-section-header">
          <div>
            <h2>Recent Food Listings</h2>

            <p>
              Total food quantity listed:{' '}
              {stats.totalQuantity || 0}
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={() =>
              navigate('/my-food')
            }
          >
            View All
          </button>
        </div>

        {foodItems.length === 0 ? (
          <div className="empty-dashboard">
            <h3>No Food Listings Yet</h3>

            <p>
              Start rescuing surplus food by
              adding your first food listing.
            </p>

            <button
              className="auth-btn"
              onClick={() =>
                navigate('/add-food')
              }
            >
              Add Your First Food
            </button>
          </div>
        ) : (
          <div className="food-listings">
            {foodItems
              .slice(0, 5)
              .map((food) => (
                <div
                  className="food-listing-item"
                  key={food.id}
                >
                  <div>
                    <h3>
                      {food.foodName}
                    </h3>

                    <p>
                      Remaining:{' '}
                      {food.remainingQuantity}{' '}
                      / {food.quantity}
                    </p>
                  </div>

                  <div>
                    <p>
                      Rescue Price: ₹
                      {food.rescuePrice}
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