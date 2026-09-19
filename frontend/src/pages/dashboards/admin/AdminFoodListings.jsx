import { useEffect, useState } from 'react'
import { apiFetch } from '../../../utils/api'

function AdminFoodListings() {
  const [foodListings, setFoodListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadFoodListings = async () => {
    try {
      setLoading(true)
      setMessage('')

      const response = await apiFetch(
        '/api/admin/food-listings'
      )

      if (!response.ok) {
        const errorText = await response.text()

        throw new Error(
          `Unable to load food listings (${response.status}) ${
            errorText || response.statusText
          }`
        )
      }

      const data = await response.json()
      setFoodListings(data)
    } catch (error) {
      console.error(error)
      setMessage(
        error.message ||
        'Unable to load food listings'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFoodListings()
  }, [])

  if (loading) {
    return (
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <div className="admin-brand-icon">F</div>
            <div>
              <strong>FoodRescue</strong>
              <span>Administration</span>
            </div>
          </div>

          <nav className="admin-nav">
            <button onClick={() => window.location.href = '/admin'}>
              Dashboard
            </button>

            <button onClick={() => window.location.href = '/admin/users'}>
              Users
            </button>

            <button className="active">
              Food Listings
            </button>

            <button onClick={() => window.location.href = '/admin/reservations'}>
              Reservations
            </button>

            <button onClick={() => window.location.href = '/admin/donations'}>
              Donations
            </button>

            <button onClick={() => window.location.href = '/admin/food-needs'}>
              Food Needs
            </button>
          </nav>

          <div className="admin-sidebar-bottom">
            <div className="admin-profile">
              <div className="admin-avatar">A</div>
              <div>
                <strong>Administrator</strong>
                <span>System Admin</span>
              </div>
            </div>

            <button
              className="admin-back-btn"
              onClick={() => window.location.href = '/'}
            >
              Back to Website
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-topbar">
            <div>
              <h1>Food Listings</h1>
              <p>Monitor surplus food listings across the platform.</p>
            </div>

            <div className="admin-status">
              <span></span>
              System Online
            </div>
          </div>

          <div className="admin-loading">
            <div className="admin-loader"></div>
            <p>Loading food listings...</p>
          </div>
        </main>
      </div>
    )
  }

  const availableCount = foodListings.filter(
    food => food.status === 'AVAILABLE'
  ).length

  const soldOutCount = foodListings.filter(
    food => food.status === 'SOLD_OUT'
  ).length

  const expiredCount = foodListings.filter(
    food => food.status === 'EXPIRED'
  ).length

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-brand-icon">F</div>

          <div>
            <strong>FoodRescue</strong>
            <span>Administration</span>
          </div>
        </div>

        <nav className="admin-nav">

          <button
            onClick={() =>
              window.location.href = '/admin'
            }
          >
            <span>Dashboard</span>
          </button>

          <button
            onClick={() =>
              window.location.href = '/admin/users'
            }
          >
            <span>Users</span>
          </button>

          <button className="active">
            <span>Food Listings</span>
          </button>

          <button
            onClick={() =>
              window.location.href = '/admin/reservations'
            }
          >
            <span>Reservations</span>
          </button>

          <button
            onClick={() =>
              window.location.href = '/admin/donations'
            }
          >
            <span>Donations</span>
          </button>

          <button
            onClick={() =>
              window.location.href = '/admin/food-needs'
            }
          >
            <span>Food Needs</span>
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
            className="admin-back-btn"
            onClick={() =>
              window.location.href = '/'
            }
          >
            Back to Website
          </button>

        </div>

      </aside>

      <main className="admin-main">

        <div className="admin-topbar">

          <div>
            <h1>Food Listings</h1>
            <p>
              Monitor surplus food listings across the platform.
            </p>
          </div>

          <div className="admin-status">
            <span></span>
            System Online
          </div>

        </div>

        <section className="admin-welcome">

          <div>
            <span className="admin-eyebrow">
              FOOD MONITORING
            </span>

            <h2>
              Surplus Food Overview
            </h2>

            <p>
              Track available food, sold-out listings,
              and expired surplus items.
            </p>
          </div>

        </section>

        {message && (
          <div className="admin-error">
            {message}
          </div>
        )}

        <section className="admin-stats">

          <div className="admin-stat-card">
            <div>
              <span>Total Listings</span>
              <strong>
                {foodListings.length}
              </strong>
            </div>

            <div className="admin-stat-icon purple">
              F
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <span>Available</span>
              <strong>
                {availableCount}
              </strong>
            </div>

            <div className="admin-stat-icon green">
              A
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <span>Sold Out</span>
              <strong>
                {soldOutCount}
              </strong>
            </div>

            <div className="admin-stat-icon blue">
              S
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <span>Expired</span>
              <strong>
                {expiredCount}
              </strong>
            </div>

            <div className="admin-stat-icon pink">
              E
            </div>
          </div>

        </section>

        <section className="admin-panel">

          <div className="admin-panel-header">

            <div>
              <h2>All Food Listings</h2>
              <p>
                Complete surplus food listing records.
              </p>
            </div>

            <span className="admin-count">
              {foodListings.length} Listings
            </span>

          </div>

          {foodListings.length === 0 ? (

            <div className="admin-empty">
              <h3>No food listings found</h3>
              <p>
                There are currently no food listings
                available to monitor.
              </p>
            </div>

          ) : (

            <div className="food-listing-grid">

              {foodListings.map(food => (

                <div
                  className="food-listing-card"
                  key={food.id}
                >

                  <div className="food-listing-header">

                    <div>
                      <h3>
                        {food.foodName}
                      </h3>

                      <p>
                        {food.restaurantName ||
                          'Restaurant not provided'}
                      </p>
                    </div>

                    <span
                      className={`food-status ${String(
                        food.status || ''
                      ).toLowerCase()}`}
                    >
                      {food.status}
                    </span>

                  </div>

                  <div className="food-listing-details">

                    <div>
                      <span>Quantity</span>
                      <strong>
                        {food.quantity}
                      </strong>
                    </div>

                    <div>
                      <span>Remaining</span>
                      <strong>
                        {food.remainingQuantity}
                      </strong>
                    </div>

                    <div>
                      <span>Original Price</span>
                      <strong>
                        ₹{food.originalPrice}
                      </strong>
                    </div>

                    <div>
                      <span>Rescue Price</span>
                      <strong>
                        ₹{food.rescuePrice}
                      </strong>
                    </div>

                  </div>

                  <div className="food-listing-footer">

                    <div>
                      <span>Pickup Deadline</span>
                      <strong>
                        {food.pickupDeadline ||
                          'Not provided'}
                      </strong>
                    </div>

                    {food.allergens && (
                      <div>
                        <span>Allergens</span>
                        <strong>
                          {food.allergens}
                        </strong>
                      </div>
                    )}

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

export default AdminFoodListings
