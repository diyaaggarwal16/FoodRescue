import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../utils/api'

function AdminDonations() {
  const navigate = useNavigate()

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
        const errorText = await response.text()

        throw new Error(
          `Unable to load donations (${response.status}) ${
            errorText || response.statusText
          }`
        )
      }

      const data = await response.json()

      setDonations(
        Array.isArray(data) ? data : []
      )
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

  const getStatus = donation =>
    String(
      donation.status ||
      donation.donationStatus ||
      'AVAILABLE'
    ).toUpperCase()

  const availableCount = donations.filter(
    donation =>
      getStatus(donation) === 'AVAILABLE'
  ).length

  const claimedCount = donations.filter(
    donation =>
      getStatus(donation) === 'CLAIMED'
  ).length

  const collectedCount = donations.filter(
    donation =>
      getStatus(donation) === 'COLLECTED'
  ).length

  const totalMeals = donations.reduce(
    (total, donation) =>
      total +
      Number(
        donation.quantity ||
        donation.meals ||
        donation.mealCount ||
        0
      ),
    0
  )

  const renderSidebar = () => (
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

        <button
          onClick={() =>
            navigate('/admin/reservations')
          }
        >
          Reservations
        </button>

        <button className="active">
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
  )

  if (loading) {
    return (
      <div className="admin-layout">

        {renderSidebar()}

        <main className="admin-main">

          <div className="admin-loading">

            <div className="admin-loader"></div>

            <p>
              Loading donations...
            </p>

          </div>

        </main>

      </div>
    )
  }

  return (
    <div className="admin-layout">

      {renderSidebar()}

      <main className="admin-main">

        <header className="admin-page-header">

          <div>

            <h1>
              Donation Monitoring
            </h1>

            <p>
              Track donated meals and monitor
              their collection status.
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

        <section className="donation-hero">

          <div className="donation-hero-icon">
            ♡
          </div>

          <div>

            <span className="donation-eyebrow">
              DONATION OVERVIEW
            </span>

            <h2>
              Community Meal Donations
            </h2>

            <p>
              Monitor donated meals, availability,
              claims, and successful collections
              across the FoodRescue platform.
            </p>

          </div>

          <div className="donation-hero-decoration">
            ♡
          </div>

        </section>

        <section className="donation-stats">

          <div className="donation-stat-card">

            <div className="donation-stat-icon purple">
              ♡
            </div>

            <div>
              <span>Total Donated Meals</span>

              <strong>
                {totalMeals}
              </strong>

              <small>
                Meals donated
              </small>
            </div>

          </div>

          <div className="donation-stat-card">

            <div className="donation-stat-icon blue">
              ◷
            </div>

            <div>
              <span>Available</span>

              <strong>
                {availableCount}
              </strong>

              <small>
                Awaiting claim
              </small>
            </div>

          </div>

          <div className="donation-stat-card">

            <div className="donation-stat-icon green">
              ✓
            </div>

            <div>
              <span>Claimed</span>

              <strong>
                {claimedCount}
              </strong>

              <small>
                Claimed donations
              </small>
            </div>

          </div>

          <div className="donation-stat-card">

            <div className="donation-stat-icon orange">
              ◆
            </div>

            <div>
              <span>Collected</span>

              <strong>
                {collectedCount}
              </strong>

              <small>
                Successfully collected
              </small>
            </div>

          </div>

        </section>

        <section className="donation-panel">

          <div className="donation-panel-header">

            <div>
              <h2>
                All Donated Meals
              </h2>

              <p>
                Complete list of community meal donations.
              </p>
            </div>

            <span className="donation-count">
              {donations.length}{' '}
              {donations.length === 1
                ? 'Donation'
                : 'Donations'}
            </span>

          </div>

          {donations.length === 0 ? (

            <div className="donation-empty">

              <div className="donation-empty-icon">
                ♡
              </div>

              <h3>
                No Donated Meals
              </h3>

              <p>
                There are currently no donated meals
                available on the platform.
              </p>

            </div>

          ) : (

            <div className="donation-list">

              {donations.map(donation => {

                const status =
                  getStatus(donation)

                const donorName =
                  donation.donorName ||
                  donation.restaurantName ||
                  donation.donor?.name ||
                  'Anonymous Donor'

                const foodName =
                  donation.foodName ||
                  donation.mealName ||
                  donation.foodListing?.foodName ||
                  'Donated Meal'

                const quantity =
                  donation.quantity ||
                  donation.meals ||
                  donation.mealCount ||
                  0

                const recipient =
                  donation.ngoName ||
                  donation.recipientName ||
                  donation.ngo?.name ||
                  'Not assigned'

                const date =
                  donation.createdAt ||
                  donation.donationDate ||
                  donation.date

                return (

                  <article
                    className="donation-card"
                    key={donation.id}
                  >

                    <div className="donation-card-main">

                      <div className="donation-food-icon">
                        ♡
                      </div>

                      <div>

                        <div className="donation-title-row">

                          <h3>
                            {foodName}
                          </h3>

                          <span
                            className={`donation-badge ${status.toLowerCase()}`}
                          >
                            {status}
                          </span>

                        </div>

                        <p>
                          Donor:{' '}
                          <strong>
                            {donorName}
                          </strong>
                        </p>

                        <p className="donation-muted">
                          Recipient:{' '}
                          {recipient}
                        </p>

                      </div>

                    </div>

                    <div className="donation-info">

                      <span>
                        Meals
                      </span>

                      <strong>
                        {quantity}
                      </strong>

                    </div>

                    <div className="donation-info">

                      <span>
                        Status
                      </span>

                      <span
                        className={`donation-badge ${status.toLowerCase()}`}
                      >
                        {status}
                      </span>

                    </div>

                    <div className="donation-info">

                      <span>
                        Donated On
                      </span>

                      <strong className="donation-date">
                        {date
                          ? new Date(
                              date
                            ).toLocaleDateString(
                              'en-GB'
                            )
                          : 'Not provided'}
                      </strong>

                    </div>

                  </article>

                )
              })}

            </div>

          )}

        </section>

      </main>

    </div>
  )
}

export default AdminDonations