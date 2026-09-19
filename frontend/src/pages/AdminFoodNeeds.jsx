import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../utils/api'

function AdminFoodNeeds() {
  const navigate = useNavigate()

  const [foodNeeds, setFoodNeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadFoodNeeds = async () => {
    try {
      setLoading(true)
      setMessage('')

      const response = await apiFetch(
        '/api/admin/food-needs'
      )

      if (!response.ok) {
        const errorText = await response.text()

        throw new Error(
          `Unable to load food needs (${response.status}) ${
            errorText || response.statusText
          }`
        )
      }

      const data = await response.json()

      setFoodNeeds(
        Array.isArray(data) ? data : []
      )
    } catch (error) {
      console.error(error)

      setMessage(
        error.message ||
        'Unable to load food needs'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFoodNeeds()
  }, [])

  const getStatus = item =>
    String(
      item.status ||
      item.needStatus ||
      'OPEN'
    ).toUpperCase()

  const openCount = foodNeeds.filter(
    item => getStatus(item) === 'OPEN'
  ).length

  const partiallyFulfilledCount =
    foodNeeds.filter(
      item =>
        getStatus(item) ===
        'PARTIALLY_FULFILLED'
    ).length

  const fulfilledCount = foodNeeds.filter(
    item => getStatus(item) === 'FULFILLED'
  ).length

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

        <button
          onClick={() =>
            navigate('/admin/donations')
          }
        >
          Donations
        </button>

        <button className="active">
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
              Loading food needs...
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
              Food Need Monitoring
            </h1>

            <p>
              Monitor community food requirements
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

        <section className="need-hero">

          <div className="need-hero-icon">
            ♡
          </div>

          <div>

            <span className="need-eyebrow">
              COMMUNITY NEEDS
            </span>

            <h2>
              Food Requirement Overview
            </h2>

            <p>
              Track food requests, monitor their
              fulfillment progress, and identify
              community needs across the platform.
            </p>

          </div>

          <div className="need-hero-decoration">
            ♡
          </div>

        </section>

        <section className="need-stats">

          <div className="need-stat-card">

            <div className="need-stat-icon purple">
              ◈
            </div>

            <div>

              <span>
                Total Food Needs
              </span>

              <strong>
                {foodNeeds.length}
              </strong>

              <small>
                All registered requests
              </small>

            </div>

          </div>

          <div className="need-stat-card">

            <div className="need-stat-icon blue">
              ◷
            </div>

            <div>

              <span>
                Open
              </span>

              <strong>
                {openCount}
              </strong>

              <small>
                Awaiting fulfillment
              </small>

            </div>

          </div>

          <div className="need-stat-card">

            <div className="need-stat-icon orange">
              ◐
            </div>

            <div>

              <span>
                Partially Fulfilled
              </span>

              <strong>
                {partiallyFulfilledCount}
              </strong>

              <small>
                Currently in progress
              </small>

            </div>

          </div>

          <div className="need-stat-card">

            <div className="need-stat-icon green">
              ✓
            </div>

            <div>

              <span>
                Fulfilled
              </span>

              <strong>
                {fulfilledCount}
              </strong>

              <small>
                Successfully completed
              </small>

            </div>

          </div>

        </section>

        <section className="need-panel">

          <div className="need-panel-header">

            <div>

              <h2>
                All Food Needs
              </h2>

              <p>
                Complete list of community food
                requirements.
              </p>

            </div>

            <span className="need-count">
              {foodNeeds.length}{' '}
              {foodNeeds.length === 1
                ? 'Request'
                : 'Requests'}
            </span>

          </div>

          {foodNeeds.length === 0 ? (

            <div className="need-empty">

              <div className="need-empty-icon">
                ♡
              </div>

              <h3>
                No Food Needs Found
              </h3>

              <p>
                There are currently no food
                requirements registered on the platform.
              </p>

            </div>

          ) : (

            <div className="need-list">

              {foodNeeds.map(item => {

                const status =
                  getStatus(item)

                const requester =
                  item.requesterName ||
                  item.ngoName ||
                  item.organizationName ||
                  item.requestedBy ||
                  item.user?.name ||
                  'Unknown Requester'

                const foodName =
                  item.foodName ||
                  item.foodType ||
                  item.requiredFood ||
                  item.itemName ||
                  'Food Requirement'

                const quantity =
                  item.quantity ||
                  item.requiredQuantity ||
                  item.amount ||
                  0

                const location =
                  item.location ||
                  item.address ||
                  item.pickupLocation ||
                  'Not provided'

                const description =
                  item.description ||
                  item.details ||
                  'No additional details provided.'

                const date =
                  item.createdAt ||
                  item.requestedAt ||
                  item.requestDate ||
                  item.date

                return (

                  <article
                    className="need-card"
                    key={item.id}
                  >

                    <div className="need-card-main">

                      <div className="need-food-icon">
                        ♡
                      </div>

                      <div>

                        <div className="need-title-row">

                          <h3>
                            {foodName}
                          </h3>

                          <span
                            className={`need-badge ${status.toLowerCase()}`}
                          >
                            {status.replace(
                              /_/g,
                              ' '
                            )}
                          </span>

                        </div>

                        <p>
                          Requested by:{' '}
                          <strong>
                            {requester}
                          </strong>
                        </p>

                        <p className="need-description">
                          {description}
                        </p>

                      </div>

                    </div>

                    <div className="need-info">

                      <span>
                        Quantity
                      </span>

                      <strong>
                        {quantity}
                      </strong>

                    </div>

                    <div className="need-info">

                      <span>
                        Location
                      </span>

                      <strong className="need-location">
                        {location}
                      </strong>

                    </div>

                    <div className="need-info">

                      <span>
                        Requested On
                      </span>

                      <strong className="need-date">
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

export default AdminFoodNeeds