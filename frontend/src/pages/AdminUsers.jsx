import { useEffect, useState } from 'react'
import { apiFetch } from '../utils/api'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadUsers = async () => {
    try {
      setLoading(true)
      setMessage('')

      const response = await apiFetch('/api/admin/users')

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error(error)
      setMessage(error.message || 'Unable to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const navigate = path => {
    window.location.href = path
  }

  const customerCount = users.filter(
    user => user.role === 'CUSTOMER'
  ).length

  const restaurantCount = users.filter(
    user => user.role === 'RESTAURANT'
  ).length

  const ngoCount = users.filter(
    user => user.role === 'NGO'
  ).length

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-box">
          Loading User Management...
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

          <button
            className="admin-nav-item"
            onClick={() => navigate('/admin')}
          >
            <span className="nav-icon">⌂</span>
            Dashboard
          </button>

          <button className="admin-nav-item active">
            <span className="nav-icon">U</span>
            Users
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate('/admin/food-listings')}
          >
            <span className="nav-icon">F</span>
            Food Listings
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate('/admin/reservations')}
          >
            <span className="nav-icon">R</span>
            Reservations
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate('/admin/donations')}
          >
            <span className="nav-icon">D</span>
            Donations
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate('/admin/food-needs')}
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
            onClick={() => navigate('/')}
          >
            <span>↪</span>
            Back to Website
          </button>

        </div>

      </aside>

      <main className="admin-main">

        <header className="admin-topbar">

          <div>
            <h1>User Management</h1>
            <p>
              Manage all registered FoodRescue users
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
              Manage your
              <br />
              platform users.
            </h2>

            <p>
              View registered customers, restaurants
              and NGO accounts from one place.
            </p>
          </div>

          <div className="welcome-decoration">
            U
          </div>

        </section>

        <section className="admin-stats">

          <div className="admin-stat">
            <div className="stat-symbol">
              U
            </div>

            <div>
              <span>Total Users</span>
              <strong>{users.length}</strong>
              <small>Registered accounts</small>
            </div>
          </div>

          <div className="admin-stat">
            <div className="stat-symbol">
              C
            </div>

            <div>
              <span>Customers</span>
              <strong>{customerCount}</strong>
              <small>Food rescuers</small>
            </div>
          </div>

          <div className="admin-stat">
            <div className="stat-symbol">
              R
            </div>

            <div>
              <span>Restaurants</span>
              <strong>{restaurantCount}</strong>
              <small>Food providers</small>
            </div>
          </div>

          <div className="admin-stat">
            <div className="stat-symbol">
              N
            </div>

            <div>
              <span>NGOs</span>
              <strong>{ngoCount}</strong>
              <small>Community partners</small>
            </div>
          </div>

        </section>

        <section className="admin-panel">

          <div className="panel-header">

            <div>
              <h2>All Users</h2>
              <p>
                Registered users across the FoodRescue platform
              </p>
            </div>

            <span className="panel-count">
              {users.length}
            </span>

          </div>

          {users.length === 0 ? (
            <div className="admin-empty">
              <div>U</div>

              <strong>
                No users found
              </strong>

              <span>
                There are no registered users yet.
              </span>
            </div>
          ) : (
            <div className="verification-list">

              {users.map(user => (

                <div
                  className="verification-item"
                  key={user.id}
                >

                  <div className="verification-avatar">
                    {user.fullName
                      ? user.fullName.charAt(0).toUpperCase()
                      : 'U'}
                  </div>

                  <div className="verification-info">

                    <strong>
                      {user.fullName}
                    </strong>

                    <span>
                      {user.email}
                    </span>

                    <small>
                      User ID: {user.id}
                    </small>

                  </div>

                  <div className="user-role-badge">
                    {user.role}
                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  )
}

export default AdminUsers