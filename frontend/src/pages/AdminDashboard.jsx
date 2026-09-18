import { useEffect, useState } from 'react'
import { apiFetch } from '../utils/api'

function AdminDashboard() {
  const [restaurants, setRestaurants] = useState([])
  const [ngos, setNgos] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setMessage('')

      const [
        restaurantsResponse,
        ngosResponse
      ] = await Promise.all([
        apiFetch('/api/admin/restaurants/pending'),
        apiFetch('/api/admin/ngos/pending')
      ])

      if (!restaurantsResponse.ok) {
        throw new Error(
          await restaurantsResponse.text()
        )
      }

      if (!ngosResponse.ok) {
        throw new Error(
          await ngosResponse.text()
        )
      }

      const restaurantsData =
        await restaurantsResponse.json()

      const ngosData =
        await ngosResponse.json()

      setRestaurants(restaurantsData)
      setNgos(ngosData)

    } catch (error) {
      console.error(error)
      setMessage(
        error.message ||
        'Unable to load admin dashboard'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const verifyRestaurant = async id => {
    try {
      setMessage('')

      const response = await apiFetch(
        `/api/admin/restaurants/${id}/verify`,
        {
          method: 'PUT'
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(
          data || 'Unable to verify restaurant'
        )
        return
      }

      setMessage(
        'Restaurant verified successfully'
      )

      await loadDashboard()

    } catch (error) {
      console.error(error)
      setMessage(
        'Unable to verify restaurant'
      )
    }
  }

  const verifyNGO = async id => {
    try {
      setMessage('')

      const response = await apiFetch(
        `/api/admin/ngos/${id}/verify`,
        {
          method: 'PUT'
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(
          data || 'Unable to verify NGO'
        )
        return
      }

      setMessage(
        'NGO verified successfully'
      )

      await loadDashboard()

    } catch (error) {
      console.error(error)
      setMessage(
        'Unable to verify NGO'
      )
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page admin-dashboard">
        <div className="dashboard-container">
          <h1>Admin Dashboard</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page admin-dashboard">
      <div className="dashboard-container">

        <h1>Admin Dashboard</h1>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        <div className="dashboard-stats">

          <div className="stat-card">
            <span>Pending Restaurants</span>
            <strong>
              {restaurants.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Pending NGOs</span>
            <strong>
              {ngos.length}
            </strong>
          </div>

        </div>

        <section className="dashboard-section">

          <h2>Restaurant Verification</h2>

          {restaurants.length === 0 ? (
            <p>
              No pending restaurants.
            </p>
          ) : (
            <div className="admin-list">

              {restaurants.map(restaurant => (
                <div
                  className="admin-list-item"
                  key={restaurant.id}
                >

                  <div>

                    <h3>
                      {restaurant.restaurantName}
                    </h3>

                    <p>
                      {restaurant.address}
                    </p>

                    <p>
                      {restaurant.phone}
                    </p>

                    <span>
                      Status: {
                        restaurant.verificationStatus
                      }
                    </span>

                  </div>

                  <button
                    className="auth-btn"
                    onClick={() =>
                      verifyRestaurant(
                        restaurant.id
                      )
                    }
                  >
                    Verify
                  </button>

                </div>
              ))}

            </div>
          )}

        </section>

        <section className="dashboard-section">

          <h2>NGO Verification</h2>

          {ngos.length === 0 ? (
            <p>
              No pending NGOs.
            </p>
          ) : (
            <div className="admin-list">

              {ngos.map(ngo => (
                <div
                  className="admin-list-item"
                  key={ngo.id}
                >

                  <div>

                    <h3>
                      {ngo.ngoName}
                    </h3>

                    <p>
                      {ngo.address}
                    </p>

                    <p>
                      {ngo.phone}
                    </p>

                    <span>
                      Status: {
                        ngo.verificationStatus
                      }
                    </span>

                  </div>

                  <button
                    className="auth-btn"
                    onClick={() =>
                      verifyNGO(
                        ngo.id
                      )
                    }
                  >
                    Verify
                  </button>

                </div>
              ))}

            </div>
          )}

        </section>

        <section className="dashboard-section">

          <h2>Management</h2>

          <div className="admin-monitoring">

            <button
              className="auth-btn"
              onClick={() =>
                window.location.href =
                  '/admin/users'
              }
            >
              User Management
            </button>

            <button
              className="auth-btn"
              onClick={() =>
                window.location.href =
                  '/admin/food-listings'
              }
            >
              Food Listings Monitoring
            </button>

            <button
              className="auth-btn"
              onClick={() =>
                window.location.href =
                  '/admin/reservations'
              }
            >
              Reservation Monitoring
            </button>

            <button
              className="auth-btn"
              onClick={() =>
                window.location.href =
                  '/admin/donations'
              }
            >
              Donation Monitoring
            </button>

            <button
              className="auth-btn"
              onClick={() =>
                window.location.href =
                  '/admin/food-needs'
              }
            >
              Food Need Monitoring
            </button>

          </div>

        </section>

      </div>
    </div>
  )
}

export default AdminDashboard