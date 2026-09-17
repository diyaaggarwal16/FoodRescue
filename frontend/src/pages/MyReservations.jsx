import { useEffect, useState } from 'react'
import { apiFetch } from '../utils/api'

function MyReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(localStorage.getItem('user'))
const customerEmail = user?.email

  useEffect(() => {
  if (!customerEmail) {
    setLoading(false)
    return
  }

  apiFetch(
  `/api/reservations/customer/${customerEmail}`
)
    .then((response) => response.json())
    .then((data) => {
      setReservations(data)
      setLoading(false)
    })
    .catch(() => {
      setLoading(false)
    })
}, [customerEmail])
  return (
    <div className="food-page">
      <div className="food-header">
        <div>
          <h1>My Reservations</h1>
          <p>View your reserved food and pickup details.</p>
        </div>
      </div>

      {loading ? (
        <p>Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <div className="food-card">
          <div className="food-content">
            <h2>No reservations yet</h2>
            <p>
              Your food reservations will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="food-grid">
          {reservations.map((reservation) => (
            <div
              className="food-card"
              key={reservation.id}
            >
              <div className="food-content">
                <h2>Reservation #{reservation.id}</h2>

                <p>
                  Food Listing ID: {reservation.foodListingId}
                </p>

                <p>
                  Quantity: {reservation.quantity}
                </p>

                <p>
                  Total Price: ₹{reservation.totalPrice}
                </p>

                <p>
                  Customer: {reservation.customerName}
                </p>

                <p>
                  Email: {reservation.customerEmail}
                </p>

                <div className="price">
                  <strong>{reservation.status}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyReservations