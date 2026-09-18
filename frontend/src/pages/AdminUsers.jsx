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

      const response = await apiFetch(
        '/api/admin/users'
      )

      if (!response.ok) {
        throw new Error(
          await response.text()
        )
      }

      const data = await response.json()
      setUsers(data)

    } catch (error) {
      console.error(error)
      setMessage(
        error.message ||
        'Unable to load users'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-page admin-dashboard">
        <div className="dashboard-container">
          <h1>User Management</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page admin-dashboard">
      <div className="dashboard-container">

        <h1>User Management</h1>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        <div className="dashboard-stats">

          <div className="stat-card">
            <span>Total Users</span>
            <strong>
              {users.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Customers</span>
            <strong>
              {
                users.filter(
                  user =>
                    user.role === 'CUSTOMER'
                ).length
              }
            </strong>
          </div>

          <div className="stat-card">
            <span>Restaurants</span>
            <strong>
              {
                users.filter(
                  user =>
                    user.role === 'RESTAURANT'
                ).length
              }
            </strong>
          </div>

          <div className="stat-card">
            <span>NGOs</span>
            <strong>
              {
                users.filter(
                  user =>
                    user.role === 'NGO'
                ).length
              }
            </strong>
          </div>

        </div>

        <section className="dashboard-section">

          <h2>All Users</h2>

          {users.length === 0 ? (
            <p>
              No users found.
            </p>
          ) : (
            <div className="admin-list">

              {users.map(user => (
                <div
                  className="admin-list-item"
                  key={user.id}
                >
                  <div>

                    <h3>
                      {user.fullName}
                    </h3>

                    <p>
                      {user.email}
                    </p>

                    <span>
                      Role: {user.role}
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

export default AdminUsers