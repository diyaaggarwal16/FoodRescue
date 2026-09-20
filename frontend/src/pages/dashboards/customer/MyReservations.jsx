import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { apiFetch } from '../../../utils/api'

function MyReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('ALL')

  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  )

  const userName =
    user.fullName ||
    user.name ||
    user.email?.split('@')[0] ||
    'Customer'

  const email = user.email || ''

  const loadReservations = async () => {
    if (!email) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await apiFetch(
        `/api/reservations/customer/${encodeURIComponent(email)}`
      )

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()

      setReservations(
        Array.isArray(data) ? data : []
      )
    } catch (error) {
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

  const formatDate = (value) => {
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isReady = (reservation) =>
    String(reservation.status || '')
      .toUpperCase() === 'READY_FOR_PICKUP'

  const filteredReservations = useMemo(() => {
    if (filter === 'ALL') {
      return reservations
    }

    if (filter === 'READY') {
      return reservations.filter(isReady)
    }

    return reservations.filter(
      (reservation) =>
        String(reservation.status || '')
          .toUpperCase() === filter
    )
  }, [reservations, filter])

  const reservedCount =
    reservations.length

  const readyCount =
    reservations.filter(isReady).length

  const completedCount =
    reservations.filter(
      (reservation) =>
        String(reservation.status || '')
          .toUpperCase() === 'COMPLETED'
    ).length

  const totalSpent =
    reservations.reduce(
      (total, reservation) =>
        total +
        Number(reservation.totalPrice || 0),
      0
    )

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
            className="customer-navigation-item"
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
            className="customer-navigation-item active"
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
              placeholder="Search your reservations..."
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
                CUSTOMER ACTIVITY
              </span>

              <h1>
                My Reservations
              </h1>

              <p>
                Track your rescued meals and
                upcoming pickups.
              </p>

            </div>

            <Link
              to="/food"
              className="customer-primary-button"
            >
              Explore Food
              <b>
                →
              </b>
            </Link>

          </div>

          <section className="customer-stat-grid">

            <div className="customer-stat-card">

              <div className="customer-stat-icon">
                R
              </div>

              <div>
                <span>
                  Total Reservations
                </span>

                <strong>
                  {reservedCount}
                </strong>

                <small>
                  All your reservations
                </small>
              </div>

            </div>

            <div className="customer-stat-card">

              <div className="customer-stat-icon">
                P
              </div>

              <div>
                <span>
                  Ready for Pickup
                </span>

                <strong>
                  {readyCount}
                </strong>

                <small>
                  Pickup available
                </small>
              </div>

            </div>

            <div className="customer-stat-card">

              <div className="customer-stat-icon">
                C
              </div>

              <div>
                <span>
                  Completed
                </span>

                <strong>
                  {completedCount}
                </strong>

                <small>
                  Meals rescued
                </small>
              </div>

            </div>

            <div className="customer-stat-card">

              <div className="customer-stat-icon">
                ₹
              </div>

              <div>
                <span>
                  Total Spent
                </span>

                <strong>
                  ₹{totalSpent}
                </strong>

                <small>
                  Across reservations
                </small>
              </div>

            </div>

          </section>

          <section className="customer-section">

            <div className="customer-section-header">

              <div>

                <span>
                  RESERVATION HISTORY
                </span>

                <h2>
                  Your Reservations
                </h2>

                <p>
                  Review your current and previous
                  food reservations.
                </p>

              </div>

              <div className="customer-filter-group">

                <button
                  type="button"
                  className={
                    filter === 'ALL'
                      ? 'customer-filter active'
                      : 'customer-filter'
                  }
                  onClick={() =>
                    setFilter('ALL')
                  }
                >
                  All
                </button>

                <button
                  type="button"
                  className={
                    filter === 'READY'
                      ? 'customer-filter active'
                      : 'customer-filter'
                  }
                  onClick={() =>
                    setFilter('READY')
                  }
                >
                  Ready
                </button>

                <button
                  type="button"
                  className={
                    filter === 'COMPLETED'
                      ? 'customer-filter active'
                      : 'customer-filter'
                  }
                  onClick={() =>
                    setFilter('COMPLETED')
                  }
                >
                  Completed
                </button>

              </div>

            </div>

            {message && (
              <div className="customer-alert">
                {message}
              </div>
            )}

            {loading ? (

              <div className="customer-empty-card">

                <div className="customer-loader"></div>

                <span>
                  Loading reservations...
                </span>

              </div>

            ) : filteredReservations.length === 0 ? (

              <div className="customer-empty-card">

                <div className="customer-empty-icon">
                  R
                </div>

                <h3>
                  No reservations found
                </h3>

                <p>
                  Your reserved meals will appear
                  here.
                </p>

                <Link
                  to="/food"
                  className="customer-primary-button"
                >
                  Explore Food
                </Link>

              </div>

            ) : (

              <div className="customer-reservations-page-list">

                {filteredReservations.map(
                  (reservation) => (

                    <article
                      className="customer-reservation-card"
                      key={reservation.id}
                    >

                      <div className="customer-reservation-card-top">

                        <div className="customer-reservation-food-icon">
                          F
                        </div>

                        <div className="customer-reservation-title">

                          <span>
                            RESERVATION #
                            {reservation.id}
                          </span>

                          <h3>
                            {reservation.foodName ||
                              'Reserved Food'}
                          </h3>

                          <p>
                            {reservation.restaurantName ||
                              'Restaurant'}
                          </p>

                        </div>

                        <div
                          className={
                            isReady(reservation)
                              ? 'customer-status-badge ready'
                              : 'customer-status-badge'
                          }
                        >
                          {isReady(reservation)
                            ? 'READY FOR PICKUP'
                            : reservation.status ||
                              'RESERVED'}
                        </div>

                      </div>

                      <div className="customer-reservation-card-details">

                        <div>

                          <span>
                            QUANTITY
                          </span>

                          <strong>
                            {reservation.quantity ||
                              0}
                          </strong>

                        </div>

                        <div>

                          <span>
                            TOTAL PRICE
                          </span>

                          <strong>
                            ₹
                            {reservation.totalPrice ||
                              0}
                          </strong>

                        </div>

                        <div>

                          <span>
                            FULFILLMENT
                          </span>

                          <strong>
                            {reservation.fulfillmentType ===
                            'PAY_FORWARD'
                              ? 'Pay Forward'
                              : 'Self Pickup'}
                          </strong>

                        </div>

                        <div>

                          <span>
                            RESERVED ON
                          </span>

                          <strong>
                            {formatDate(
                              reservation.createdAt ||
                                reservation.reservedAt
                            )}
                          </strong>

                        </div>

                      </div>

                      <div className="customer-reservation-card-bottom">

                        <div>

                          <span>
                            PICKUP INFORMATION
                          </span>

                          <strong>
                            {formatDate(
                              reservation.pickupDeadline ||
                                reservation.pickupTime
                            )}
                          </strong>

                        </div>

                        <div>

                          <span>
                            ALLERGENS
                          </span>

                          <strong>
                            {reservation.allergens ||
                              'None specified'}
                          </strong>

                        </div>

                      </div>

                      {isReady(reservation) &&
                        reservation.pickupOtp && (
                          <div
                            style={{
                              marginTop: '18px',
                              padding: '18px 20px',
                              borderRadius: '12px',
                              border: '1px solid rgba(192, 132, 252, 0.2)',
                              background: 'rgba(109, 40, 217, 0.08)'
                            }}
                          >
                            <span
                              style={{
                                display: 'block',
                                color: '#9787a4',
                                fontSize: '10px',
                                letterSpacing: '0.08em',
                                marginBottom: '7px'
                              }}
                            >
                              PICKUP OTP
                            </span>

                            <strong
                              style={{
                                display: 'block',
                                color: '#f4edfa',
                                fontSize: '28px',
                                letterSpacing: '0.18em'
                              }}
                            >
                              {reservation.pickupOtp}
                            </strong>

                            <small
                              style={{
                                display: 'block',
                                color: '#80708d',
                                marginTop: '6px'
                              }}
                            >
                              Show this OTP at the restaurant
                              during pickup.
                            </small>
                          </div>
                        )}

                    </article>

                  )
                )}

              </div>

            )}

          </section>

        </main>

      </div>

    </div>
  )
}

export default MyReservations