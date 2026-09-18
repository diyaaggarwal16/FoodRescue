import { useEffect, useState } from 'react'
import { apiFetch } from '../utils/api'

function AdminReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadReservations = async () => {
    try {
      setLoading(true)
      setMessage('')

      const response = await apiFetch(
        '/api/admin/reservations'
      )

      if (!response.ok) {
        throw new Error(
          await response.text()
        )
      }

      const data = await response.json()

      setReservations(data)

    } catch (error) {
      console.error(error)
      setMessage(
        error.message ||
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
      <div className="dashboard-page">
        <div className="dashboard-container">
          <h1>Reservation Monitoring</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        <h1>Reservation Monitoring</h1>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        <div className="dashboard-stats">

          <div className="stat-card">
            <span>Total Reservations</span>
            <strong>
              {reservations.length}
            </strong>
          </div>

        </div>

        <section className="dashboard-section">

          <h2>All Reservations</h2>

          {reservations.length === 0 ? (
            <p>
              No reservations found.
            </p>
          ) : (
            <div className="admin-list">

              {reservations.map(reservation => (
                <div
                  className="admin-list-item"
                  key={reservation.id}
                >

                  <div>

                    <h3>
                      Reservation #{reservation.id}
                    </h3>

                    <p>
                      Customer: {
                        reservation.customerName ||
                        'Not provided'
                      }
                    </p>

                    <p>
                      Email: {
                        reservation.customerEmail ||
                        'Not provided'
                      }
                    </p>

                    <p>
                      Food Listing ID: {
                        reservation.foodListingId
                      }
                    </p>

                    <p>
                      Quantity: {
                        reservation.quantity
                      }
                    </p>

                    <p>
                      Total Price: ₹{
                        reservation.totalPrice
                      }
                    </p>

                    <p>
                      Fulfillment: {
                        reservation.fulfillmentType ||
                        'Not provided'
                      }
                    </p>

                    <p>
                      Status: {
                        reservation.status
                      }
                    </p>

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

export default AdminReservations