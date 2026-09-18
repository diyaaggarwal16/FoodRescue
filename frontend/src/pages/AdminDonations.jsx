import { useEffect, useState } from 'react'
import { apiFetch } from '../utils/api'

function AdminDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadDonations = async () => {
    try {
      setLoading(true)
      setMessage('')

      const response = await apiFetch(
        '/api/admin/donated-meals'
      )

      if (!response.ok) {
        throw new Error(
          await response.text()
        )
      }

      const data = await response.json()

      setDonations(data)

    } catch (error) {
      console.error(error)
      setMessage(
        error.message ||
        'Unable to load donations'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDonations()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <h1>Donation Monitoring</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        <h1>Donation Monitoring</h1>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        <div className="dashboard-stats">

          <div className="stat-card">
            <span>Total Donated Meals</span>
            <strong>
              {donations.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Available</span>
            <strong>
              {
                donations.filter(
                  donation =>
                    donation.status === 'AVAILABLE'
                ).length
              }
            </strong>
          </div>

          <div className="stat-card">
            <span>Claimed</span>
            <strong>
              {
                donations.filter(
                  donation =>
                    donation.status === 'CLAIMED'
                ).length
              }
            </strong>
          </div>

          <div className="stat-card">
            <span>Collected</span>
            <strong>
              {
                donations.filter(
                  donation =>
                    donation.status === 'COLLECTED'
                ).length
              }
            </strong>
          </div>

        </div>

        <section className="dashboard-section">

          <h2>All Donated Meals</h2>

          {donations.length === 0 ? (
            <p>
              No donated meals found.
            </p>
          ) : (
            <div className="admin-list">

              {donations.map(donation => (
                <div
                  className="admin-list-item"
                  key={donation.id}
                >

                  <div>

                    <h3>
                      Donation #{donation.id}
                    </h3>

                    <p>
                      Reservation ID: {
                        donation.reservationId
                      }
                    </p>

                    <p>
                      Food Listing ID: {
                        donation.foodListingId
                      }
                    </p>

                    <p>
                      Quantity: {
                        donation.quantity
                      }
                    </p>

                    <p>
                      Claimed NGO ID: {
                        donation.claimedByNgoId ||
                        'Not claimed'
                      }
                    </p>

                    <span>
                      Status: {
                        donation.status
                      }
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

export default AdminDonations