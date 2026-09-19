import { useEffect, useState } from 'react'
import { apiFetch } from '../../../utils/api'

function MyReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadReservations = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem('user')
      )

      if (!user?.email) {
        setMessage('Please login again')
        return
      }

      const response = await apiFetch(
        `/api/reservations/customer/${encodeURIComponent(
          user.email
        )}`
      )

      if (!response.ok) {
        const error =
          await response.text()

        setMessage(
          error || 'Unable to load reservations'
        )
        return
      }

      const data = await response.json()
      setReservations(data)
    } catch (error) {
      console.error(error)
      setMessage(
        'Unable to load reservations'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReservations()
  }, [])

  if (loading) {
    return (
      <div className="page-container">
        <h1>My Reservations</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>My Reservations</h1>
          <p>
            Track your food reservations and pickup details.
          </p>
        </div>
      </div>

      {message && (
        <div className="dashboard-card">
          <p>{message}</p>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="dashboard-card">
          <p>
            You have no reservations yet.
          </p>
        </div>
      ) : (
        <div className="food-grid">
          {reservations.map((reservation) => (
            <div
              className="food-card"
              key={reservation.id}
            >
              <div className="food-content">
                <div className="reservation-card-header">
                  <div>
                    <h2>
                      {reservation.foodName}
                    </h2>

                    <p>
                      Reservation #
                      {reservation.id}
                    </p>
                  </div>

                  <span className="food-status">
                    {reservation.status}
                  </span>
                </div>

                <p>
                  Restaurant:{' '}
                  {reservation.restaurantName}
                </p>

                <div className="ngo-meal-details">
                  <div>
                    <span>Quantity</span>
                    <strong>
                      {reservation.quantity}
                    </strong>
                  </div>

                  <div>
                    <span>Rescue Price</span>
                    <strong>
                      ₹{reservation.rescuePrice}
                    </strong>
                  </div>
                </div>

                <div className="ngo-meal-details">
                  <div>
                    <span>Total</span>
                    <strong>
                      ₹{reservation.totalPrice}
                    </strong>
                  </div>

                  <div>
                    <span>Pickup</span>
                    <strong>
                      {reservation.pickupDeadline}
                    </strong>
                  </div>
                </div>

                <div className="reservation-type">
                  <span>Fulfillment</span>

                  <strong>
                    {reservation.fulfillmentType ===
                    'PAY_FORWARD'
                      ? 'Pay it forward to an NGO'
                      : 'Pick up for myself'}
                  </strong>
                </div>

                {reservation.allergens && (
                  <div className="ngo-meal-allergens">
                    <span>Allergens</span>

                    <strong>
                      {reservation.allergens}
                    </strong>
                  </div>
                )}

                {reservation.status ===
                  'READY_FOR_PICKUP' &&
                  reservation.pickupOtp && (
                    <div className="pickup-otp-card">
                      <span>Pickup OTP</span>

                      <strong>
                        {reservation.pickupOtp}
                      </strong>

                      <p>
                        Show this OTP to the restaurant
                        during pickup.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyReservations
