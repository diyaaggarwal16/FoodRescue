import { useEffect, useState } from 'react'
import { apiFetch } from '../../../utils/api'

function AdminDashboard() {
  const [restaurants, setRestaurants] = useState([])
  const [ngos, setNgos] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setMessage('')

      const [restaurantsResponse, ngosResponse] =
        await Promise.all([
          apiFetch('/api/admin/restaurants/pending'),
          apiFetch('/api/admin/ngos/pending')
        ])

      if (!restaurantsResponse.ok) {
        throw new Error(await restaurantsResponse.text())
      }

      if (!ngosResponse.ok) {
        throw new Error(await ngosResponse.text())
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
      setMessage('Unable to verify restaurant')
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

      setMessage('NGO verified successfully')

      await loadDashboard()
    } catch (error) {
      console.error(error)
      setMessage('Unable to verify NGO')
    }
  }

  const navigate = path => {
    window.location.href = path
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-box">
          Loading Admin Dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-brand-mark">
            F
          </div>

          <div>
            <strong>FoodRescue</strong>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <div className="admin-nav-title">
          MAIN MENU
        </div>

        <nav className="admin-nav">

          <button className="admin-nav-item active">
            <span className="nav-icon">⌂</span>
            Dashboard
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate('/admin/users')
            }
          >
            <span className="nav-icon">U</span>
            Users
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate('/admin/food-listings')
            }
          >
            <span className="nav-icon">F</span>
            Food Listings
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate('/admin/reservations')
            }
          >
            <span className="nav-icon">R</span>
            Reservations
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate('/admin/donations')
            }
          >
            <span className="nav-icon">D</span>
            Donations
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate('/admin/food-needs')
            }
          >
            <span className="nav-icon">N</span>
            Food Needs
          </button>

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-profile">
            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>System Admin</span>
            </div>
          </div>

          <button
            className="admin-logout"
            onClick={() =>
              navigate('/')
            }
          >
            <span>↪</span>
            Back to Website
          </button>

        </div>

      </aside>

      <main className="admin-main">

        <header className="admin-topbar">

          <div>
            <h1>Dashboard</h1>
            <p>
              Welcome back, Administrator
            </p>
          </div>

          <div className="admin-status">
            <span></span>
            System Online
          </div>

        </header>

        {message && (
          <div className="admin-message">
            {message}
          </div>
        )}

        <section className="admin-welcome">

          <div>
            <span>FOODRESCUE ADMIN</span>

            <h2>
              Manage your platform
              <br />
              from one place.
            </h2>

            <p>
              Monitor food redistribution,
              users and community activities.
            </p>
          </div>

          <div className="welcome-decoration">
            F
          </div>

        </section>

        <section className="admin-stats">

          <div className="admin-stat">
            <div className="stat-symbol">
              R
            </div>

            <div>
              <span>Pending Restaurants</span>
              <strong>{restaurants.length}</strong>
              <small>Awaiting verification</small>
            </div>
          </div>

          <div className="admin-stat">
            <div className="stat-symbol">
              N
            </div>

            <div>
              <span>Pending NGOs</span>
              <strong>{ngos.length}</strong>
              <small>Awaiting verification</small>
            </div>
          </div>

        </section>

        <section className="admin-content-grid">

          <div className="admin-panel">

            <div className="panel-header">
              <div>
                <h2>Restaurant Verification</h2>
                <p>
                  Review pending restaurant accounts
                </p>
              </div>

              <span className="panel-count">
                {restaurants.length}
              </span>
            </div>

            {restaurants.length === 0 ? (
              <div className="admin-empty">
                <div>✓</div>
                <strong>
                  No pending restaurants
                </strong>
                <span>
                  Everything is up to date.
                </span>
              </div>
            ) : (
              <div className="verification-list">

                {restaurants.map(restaurant => (
                  <div
                    className="verification-item"
                    key={restaurant.id}
                  >
                    <div className="verification-avatar">
                      R
                    </div>

                    <div className="verification-info">
                      <strong>
                        {restaurant.restaurantName}
                      </strong>

                      <span>
                        {restaurant.address}
                      </span>

                      <small>
                        {restaurant.phone}
                      </small>
                    </div>

                    <button
                      className="verify-action"
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

          </div>

          <div className="admin-panel">

            <div className="panel-header">
              <div>
                <h2>NGO Verification</h2>
                <p>
                  Review pending NGO accounts
                </p>
              </div>

              <span className="panel-count">
                {ngos.length}
              </span>
            </div>

            {ngos.length === 0 ? (
              <div className="admin-empty">
                <div>✓</div>
                <strong>
                  No pending NGOs
                </strong>
                <span>
                  Everything is up to date.
                </span>
              </div>
            ) : (
              <div className="verification-list">

                {ngos.map(ngo => (
                  <div
                    className="verification-item"
                    key={ngo.id}
                  >
                    <div className="verification-avatar ngo">
                      N
                    </div>

                    <div className="verification-info">
                      <strong>
                        {ngo.ngoName}
                      </strong>

                      <span>
                        {ngo.address}
                      </span>

                      <small>
                        {ngo.phone}
                      </small>
                    </div>

                    <button
                      className="verify-action"
                      onClick={() =>
                        verifyNGO(ngo.id)
                      }
                    >
                      Verify
                    </button>
                  </div>
                ))}

              </div>
            )}

          </div>

        </section>

        <section className="admin-panel management-panel">

          <div className="panel-header">
            <div>
              <h2>Quick Management</h2>
              <p>
                Access different areas of the platform
              </p>
            </div>
          </div>

          <div className="management-grid">

            <button
              onClick={() =>
                navigate('/admin/users')
              }
              className="management-item"
            >
              <div className="management-icon">
                U
              </div>

              <div>
                <strong>User Management</strong>
                <span>
                  Manage users and roles
                </span>
              </div>

              <b>→</b>
            </button>

            <button
              onClick={() =>
                navigate('/admin/food-listings')
              }
              className="management-item"
            >
              <div className="management-icon">
                F
              </div>

              <div>
                <strong>Food Listings</strong>
                <span>
                  Monitor surplus food
                </span>
              </div>

              <b>→</b>
            </button>

            <button
              onClick={() =>
                navigate('/admin/reservations')
              }
              className="management-item"
            >
              <div className="management-icon">
                R
              </div>

              <div>
                <strong>Reservations</strong>
                <span>
                  Track reservations
                </span>
              </div>

              <b>→</b>
            </button>

            <button
              onClick={() =>
                navigate('/admin/donations')
              }
              className="management-item"
            >
              <div className="management-icon">
                D
              </div>

              <div>
                <strong>Donations</strong>
                <span>
                  Monitor food donations
                </span>
              </div>

              <b>→</b>
            </button>

            <button
              onClick={() =>
                navigate('/admin/food-needs')
              }
              className="management-item"
            >
              <div className="management-icon">
                N
              </div>

              <div>
                <strong>Food Needs</strong>
                <span>
                  NGO requirements
                </span>
              </div>

              <b>→</b>
            </button>

          </div>

        </section>

      </main>

    </div>
  )
}

export default AdminDashboard
