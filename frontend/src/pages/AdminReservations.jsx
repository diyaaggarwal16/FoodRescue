import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../utils/api'

function AdminReservations() {
  const navigate = useNavigate()

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
        const errorText = await response.text()

        throw new Error(
          `Unable to load reservations (${response.status}) ${
            errorText || response.statusText
          }`
        )
      }

      const data = await response.json()

      setReservations(
        Array.isArray(data) ? data : []
      )
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

  const reservedCount = reservations.filter(
    item =>
      String(item.status || '').toUpperCase() ===
      'RESERVED'
  ).length

  const fulfilledCount = reservations.filter(
    item =>
      String(
        item.status ||
        item.fulfillmentStatus ||
        ''
      ).toUpperCase() === 'FULFILLED'
  ).length

  const cancelledCount = reservations.filter(
    item =>
      String(item.status || '').toUpperCase() ===
      'CANCELLED'
  ).length

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
            <button
              onClick={() =>
                navigate('/admin')
              }
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                navigate('/admin/users')
              }
            >
              Users
            </button>

            <button
              onClick={() =>
                navigate('/admin/food-listings')
              }
            >
              Food Listings
            </button>

            <button className="active">
              Reservations
            </button>

            <button
              onClick={() =>
                navigate('/admin/donations')
              }
            >
              Donations
            </button>

            <button
              onClick={() =>
                navigate('/admin/food-needs')
              }
            >
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
              className="admin-back-btn"
              onClick={() =>
                navigate('/')
              }
            >
              Back to Website
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-loading">
            <div className="admin-loader"></div>
            <p>Loading reservations...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="admin-brand-icon">
            F
          </div>

          <div>
            <strong>FoodRescue</strong>
            <span>Administration</span>
          </div>

        </div>

        <nav className="admin-nav">

          <button
            onClick={() =>
              navigate('/admin')
            }
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate('/admin/users')
            }
          >
            Users
          </button>

          <button
            onClick={() =>
              navigate('/admin/food-listings')
            }
          >
            Food Listings
          </button>

          <button className="active">
            Reservations
          </button>

          <button
            onClick={() =>
              navigate('/admin/donations')
            }
          >
            Donations
          </button>

          <button
            onClick={() =>
              navigate('/admin/food-needs')
            }
          >
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
            className="admin-back-btn"
            onClick={() =>
              navigate('/')
            }
          >
            Back to Website
          </button>

        </div>

      </aside>

      <main className="admin-main">

        <header className="admin-page-header">

          <div>
            <h1>Reservation Monitoring</h1>

            <p>
              Track and manage food reservations
              across the platform.
            </p>
          </div>

          <div className="admin-system-status">
            <span></span>
            System Online
          </div>

        </header>

        {message && (
          <div className="admin-error">
            {message}
          </div>
        )}

        <section className="reservation-hero">

          <div className="reservation-hero-icon">
            ▣
          </div>

          <div>

            <span className="reservation-eyebrow">
              RESERVATION OVERVIEW
            </span>

            <h2>
              Reservation Overview
            </h2>

            <p>
              Monitor all food reservations, track
              fulfillment status, and ensure smooth
              pickup and delivery for our community.
            </p>

          </div>

          <div className="reservation-hero-decoration">
            ❧
          </div>

        </section>

        <section className="reservation-stats">

          <div className="reservation-stat-card">

            <div className="reservation-stat-icon purple">
              ▣
            </div>

            <div>
              <span>Total Reservations</span>
              <strong>
                {reservations.length}
              </strong>
              <small>
                All time reservations
              </small>
            </div>

          </div>

          <div className="reservation-stat-card">

            <div className="reservation-stat-icon green">
              ✓
            </div>

            <div>
              <span>Reserved</span>
              <strong>
                {reservedCount}
              </strong>
              <small>
                Awaiting pickup
              </small>
            </div>

          </div>

          <div className="reservation-stat-card">

            <div className="reservation-stat-icon blue">
              ◷
            </div>

            <div>
              <span>Fulfilled</span>
              <strong>
                {fulfilledCount}
              </strong>
              <small>
                Completed successfully
              </small>
            </div>

          </div>

          <div className="reservation-stat-card">

            <div className="reservation-stat-icon red">
              ×
            </div>

            <div>
              <span>Cancelled</span>
              <strong>
                {cancelledCount}
              </strong>
              <small>
                Cancelled by user
              </small>
            </div>

          </div>

        </section>

        <section className="reservation-panel">

          <div className="reservation-panel-header">

            <div>
              <h2>
                All Reservations
              </h2>

              <p>
                Complete list of all food reservations.
              </p>
            </div>

            <span className="reservation-count">
              {reservations.length}{' '}
              {reservations.length === 1
                ? 'Reservation'
                : 'Reservations'}
            </span>

          </div>

          {reservations.length === 0 ? (

            <div className="reservation-empty">

              <div>▣</div>

              <h3>
                No Reservations Found
              </h3>

              <p>
                There are currently no reservations
                on the platform.
              </p>

            </div>

          ) : (

            <div className="reservation-list">

              {reservations.map(
                reservation => {

                  const status =
                    String(
                      reservation.status ||
                      'RESERVED'
                    ).toUpperCase()

                  const customerName =
                    reservation.customerName ||
                    reservation.customer?.name ||
                    'Unknown Customer'

                  const customerEmail =
                    reservation.customerEmail ||
                    reservation.customer?.email ||
                    'Not provided'

                  const foodListingId =
                    reservation.foodListingId ||
                    reservation.foodListing?.id ||
                    'Not provided'

                  const quantity =
                    reservation.quantity ?? 0

                  const totalPrice =
                    reservation.totalPrice ?? 0

                  const fulfillment =
                    reservation.fulfillmentStatus ||
                    reservation.fulfillment ||
                    'Not provided'

                  const reservedDate =
                    reservation.reservedAt ||
                    reservation.reservationDate ||
                    reservation.createdAt

                  return (
                    <article
                      className="reservation-card"
                      key={reservation.id}
                    >

                      <div className="reservation-customer">

                        <div className="reservation-food-icon">
                          ♡
                        </div>

                        <div className="reservation-customer-info">

                          <div className="reservation-title-row">

                            <h3>
                              Reservation #
                              {reservation.id}
                            </h3>

                            <span
                              className={`reservation-badge ${status.toLowerCase()}`}
                            >
                              {status}
                            </span>

                          </div>

                          <p>
                            Customer:{' '}
                            <strong>
                              {customerName}
                            </strong>
                          </p>

                          <p className="reservation-detail">
                            ✉ {customerEmail}
                          </p>

                          <p className="reservation-detail">
                            ≡ Food Listing ID:{' '}
                            {foodListingId}
                          </p>

                        </div>

                      </div>

                      <div className="reservation-info">

                        <span>
                          Quantity
                        </span>

                        <strong>
                          {quantity}
                        </strong>

                      </div>

                      <div className="reservation-info">

                        <span>
                          Total Price
                        </span>

                        <strong className="reservation-price">
                          ₹{totalPrice}
                        </strong>

                      </div>

                      <div className="reservation-info">

                        <span>
                          Fulfillment
                        </span>

                        <strong className="reservation-muted">
                          {fulfillment}
                        </strong>

                      </div>

                      <div className="reservation-status-column">

                        <span>
                          Status
                        </span>

                        <span
                          className={`reservation-badge ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>

                        <div className="reservation-date">

                          <span>
                            Reserved on
                          </span>

                          <strong>
                            {reservedDate
                              ? new Date(
                                  reservedDate
                                ).toLocaleDateString(
                                  'en-GB'
                                )
                              : 'Not provided'}
                          </strong>

                        </div>

                      </div>

                    </article>
                  )
                }
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  )
}

export default AdminReservations