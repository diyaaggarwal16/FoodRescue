import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { apiFetch } from '../../../utils/api'

import '../../../styles/customer.css'

function CustomerDashboard() {
  const [foodListings, setFoodListings] = useState([])
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  )

  const userName =
    user.fullName ||
    user.name ||
    user.email?.split('@')[0] ||
    'Customer'

  const userEmail = user.email || ''

  const loadDashboard = async () => {
    try {
      setLoading(true)

      const foodResponse = await apiFetch('/api/food')

      if (foodResponse.ok) {
        const data = await foodResponse.json()

        setFoodListings(
          Array.isArray(data)
            ? data
                .filter(
                  (food) =>
                    Number(
                      food.remainingQuantity || 0
                    ) > 0
                )
                .slice(0, 3)
            : []
        )
      }

      if (userEmail) {
        const reservationResponse =
          await apiFetch(
            `/api/reservations/customer/${encodeURIComponent(
              userEmail
            )}`
          )

        if (reservationResponse.ok) {
          const data =
            await reservationResponse.json()

          setReservations(
            Array.isArray(data)
              ? data
              : []
          )
        }
      }
    } catch (error) {
      console.error(
        'Unable to load customer dashboard:',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const formatDate = (value) => {
    if (!value) {
      return '—'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleDateString([], {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatPickupTime = (value) => {
    if (!value) {
      return 'Not specified'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleString([], {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="customer-app">

      <aside className="customer-sidebar">

        <div className="customer-brand">
          <div className="customer-brand-mark">
            F
          </div>

          <div>
            <strong>
              FoodRescue
            </strong>

            <span>
              CUSTOMER PANEL
            </span>
          </div>
        </div>

        <div className="customer-nav-label">
          MAIN MENU
        </div>

        <nav className="customer-navigation">

          <Link
            to="/customer/dashboard"
            className="customer-navigation-item active"
          >
            <span className="customer-navigation-icon">
              ⌂
            </span>

            <span>
              Dashboard
            </span>
          </Link>

          <Link
            to="/food"
            className="customer-navigation-item"
          >
            <span className="customer-navigation-icon">
              □
            </span>

            <span>
              Explore Food
            </span>
          </Link>

          <Link
            to="/my-reservations"
            className="customer-navigation-item"
          >
            <span className="customer-navigation-icon">
              ▣
            </span>

            <span>
              My Reservations
            </span>
          </Link>

        </nav>

        <div className="customer-sidebar-footer">

          <div className="customer-account">

            <div className="customer-account-avatar">
              {userName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {userName}
              </strong>

              <span>
                Customer
              </span>
            </div>

          </div>

          <Link
            to="/"
            className="customer-back-link"
          >
            ← Back to Website
          </Link>

        </div>

      </aside>

      <div className="customer-main">

        <header className="customer-topbar">

          <div className="customer-search">
            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search for food, restaurants, locations..."
            />
          </div>

          <div className="customer-topbar-right">

            <button
              type="button"
              className="customer-icon-button"
            >
              ♧
            </button>

            <div className="customer-top-account">

              <div className="customer-top-avatar">
                {userName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <span>
                {userName}
              </span>

              <small>
                ⌄
              </small>

            </div>

          </div>

        </header>

        <main className="customer-content">

          <div className="customer-page-header">

            <div>
              <span className="customer-page-eyebrow">
                FOODRESCUE CUSTOMER
              </span>

              <h1>
                Welcome back, {userName}.
              </h1>

              <p>
                Discover affordable surplus food
                and make every meal count.
              </p>
            </div>

            <div className="customer-header-status">

              <span className="customer-live-dot"></span>

              <div>
                <strong>
                  Marketplace Online
                </strong>

                <small>
                  Live food listings
                </small>
              </div>

            </div>

          </div>

          <section className="customer-hero-card">

            <div className="customer-hero-copy">

              <span>
                FOODRESCUE MARKETPLACE
              </span>

              <h2>
                Rescue food.
                <br />
                <em>
                  Create an impact.
                </em>
              </h2>

              <p>
                Find quality surplus meals from
                local restaurants before they go
                to waste.
              </p>

              <div className="customer-hero-actions">

                <Link
                  to="/food"
                  className="customer-primary-button"
                >
                  Explore Food
                  <b>
                    →
                  </b>
                </Link>

                <Link
                  to="/my-reservations"
                  className="customer-secondary-button"
                >
                  My Reservations
                </Link>

              </div>

            </div>

            <div className="customer-hero-art">

              <div className="customer-hero-orbit orbit-one"></div>
              <div className="customer-hero-orbit orbit-two"></div>

              <div className="customer-hero-glow"></div>

              <div className="customer-hero-card-art">
                <span>
                  F
                </span>
              </div>

              <div className="customer-floating-card floating-one">
                <small>
                  AVAILABLE
                </small>
                <strong>
                  {foodListings.length}
                </strong>
                <span>
                  Food listings
                </span>
              </div>

              <div className="customer-floating-card floating-two">
                <small>
                  RESCUE
                </small>
                <strong>
                  {reservations.length}
                </strong>
                <span>
                  Reservations
                </span>
              </div>

            </div>

          </section>

          <section className="customer-stat-grid">

            <div className="customer-stat-card">

              <div className="customer-stat-icon">
                F
              </div>

              <div>
                <span>
                  Available Food
                </span>

                <strong>
                  {foodListings.length}
                </strong>

                <small>
                  Ready to reserve
                </small>
              </div>

            </div>

            <div className="customer-stat-card">

              <div className="customer-stat-icon">
                R
              </div>

              <div>
                <span>
                  Reservations
                </span>

                <strong>
                  {reservations.length}
                </strong>

                <small>
                  Your food history
                </small>
              </div>

            </div>

            <div className="customer-stat-card">

              <div className="customer-stat-icon">
                P
              </div>

              <div>
                <span>
                  Pickup
                </span>

                <strong>
                  {reservations.filter(
                    (item) =>
                      String(
                        item.status || ''
                      ).toUpperCase() ===
                      'READY'
                  ).length}
                </strong>

                <small>
                  Ready for pickup
                </small>
              </div>

            </div>

            <div className="customer-stat-card">

              <div className="customer-stat-icon">
                I
              </div>

              <div>
                <span>
                  Member Since
                </span>

                <strong className="customer-date-stat">
                  {formatDate(
                    user.createdAt
                  )}
                </strong>

                <small>
                  FoodRescue member
                </small>
              </div>

            </div>

          </section>

          <section className="customer-section">

            <div className="customer-section-header">

              <div>
                <span>
                  DISCOVER
                </span>

                <h2>
                  Recommended Food
                </h2>

                <p>
                  Fresh surplus listings available
                  right now.
                </p>
              </div>

              <Link
                to="/food"
                className="customer-section-link"
              >
                View All →
              </Link>

            </div>

            {loading ? (

              <div className="customer-empty-card">
                <div className="customer-loader"></div>

                <span>
                  Loading food listings...
                </span>
              </div>

            ) : foodListings.length === 0 ? (

              <div className="customer-empty-card">

                <div className="customer-empty-icon">
                  F
                </div>

                <h3>
                  No food available right now
                </h3>

                <p>
                  New surplus food listings will
                  appear here.
                </p>

                <Link
                  to="/food"
                  className="customer-primary-button"
                >
                  Explore Food
                </Link>

              </div>

            ) : (

              <div className="customer-food-grid">

                {foodListings.map((food) => (

                  <article
                    className="customer-food-card"
                    key={food.id}
                  >

                    <div className="customer-food-visual">

                      <span>
                        FOODRESCUE
                      </span>

                      <small>
                        SURPLUS FOOD
                      </small>

                    </div>

                    <div className="customer-food-body">

                      <div className="customer-food-heading">

                        <div>
                          <h3>
                            {food.foodName}
                          </h3>

                          <span>
                            {food.restaurantName ||
                              'Restaurant'}
                          </span>
                        </div>

                        <strong>
                          ₹{food.rescuePrice}
                        </strong>

                      </div>

                      <p>
                        {food.description ||
                          'Fresh surplus food available for reservation.'}
                      </p>

                      <div className="customer-food-meta">

                        <div>
                          <span>
                            AVAILABLE
                          </span>

                          <strong>
                            {food.remainingQuantity}
                          </strong>
                        </div>

                        <div>
                          <span>
                            PICKUP
                          </span>

                          <strong>
                            {formatPickupTime(
                              food.pickupDeadline
                            )}
                          </strong>
                        </div>

                      </div>

                      <Link
                        to="/food"
                        className="customer-card-button"
                      >
                        Reserve Food
                        <b>
                          →
                        </b>
                      </Link>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>

          <section className="customer-section">

            <div className="customer-section-header">

              <div>
                <span>
                  ACTIVITY
                </span>

                <h2>
                  Recent Reservations
                </h2>

                <p>
                  Keep track of your rescued meals.
                </p>
              </div>

              <Link
                to="/my-reservations"
                className="customer-section-link"
              >
                View All →
              </Link>

            </div>

            {reservations.length === 0 ? (

              <div className="customer-empty-card compact">

                <div className="customer-empty-icon">
                  R
                </div>

                <h3>
                  No reservations yet
                </h3>

                <p>
                  Reserve your first surplus meal
                  from the marketplace.
                </p>

                <Link
                  to="/food"
                  className="customer-primary-button"
                >
                  Explore Food
                </Link>

              </div>

            ) : (

              <div className="customer-reservation-list">

                {reservations
                  .slice(0, 3)
                  .map((reservation) => (

                    <div
                      className="customer-reservation-row"
                      key={
                        reservation.id
                      }
                    >

                      <div className="customer-reservation-icon">
                        R
                      </div>

                      <div className="customer-reservation-main">

                        <strong>
                          {reservation.foodName ||
                            'Reserved Food'}
                        </strong>

                        <span>
                          {reservation.restaurantName ||
                            'Restaurant'}
                        </span>

                      </div>

                      <div className="customer-reservation-info">

                        <span>
                          QUANTITY
                        </span>

                        <strong>
                          {reservation.quantity ||
                            0}
                        </strong>

                      </div>

                      <div className="customer-reservation-info">

                        <span>
                          TOTAL
                        </span>

                        <strong>
                          ₹
                          {reservation.totalPrice ||
                            0}
                        </strong>

                      </div>

                      <div className="customer-reservation-status">

                        <span>
                          {reservation.status ||
                            'RESERVED'}
                        </span>

                      </div>

                    </div>

                  ))}

              </div>

            )}

          </section>

        </main>

      </div>

    </div>
  )
}

export default CustomerDashboard