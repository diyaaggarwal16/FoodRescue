import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiFetch, logoutUser } from '../../../utils/api'
import '../../../styles/restaurant.css'

function RestaurantFoodNeeds() {
  const navigate = useNavigate()
  const location = useLocation()
  

  const [needs, setNeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedNeed, setSelectedNeed] = useState(null)
  const [purchaseQuantity, setPurchaseQuantity] = useState('1')
  const [purchaseBusy, setPurchaseBusy] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  const loadFoodNeeds = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await apiFetch('/api/food-needs/open')

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Unable to load NGO food needs')
      }

      const data = await response.json()
      setNeeds(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Unable to load restaurant food needs:', err)
      setError(err.message || 'Unable to load NGO food needs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFoodNeeds()
  }, [])

  const getRemaining = (need) => {
    const needed = Number(need.quantityNeeded || 0)
    const fulfilled = Number(need.quantityFulfilled || 0)

    return Math.max(0, needed - fulfilled)
  }

  const formatDate = (value) => {
    if (!value) return 'Not specified'

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

  const getUrgencyClass = (urgency) => {
    const value = (urgency || 'NORMAL').toLowerCase()

    if (value === 'high' || value === 'urgent') {
      return 'rest-need-urgency-high'
    }

    if (value === 'medium') {
      return 'rest-need-urgency-medium'
    }

    return 'rest-need-urgency-normal'
  }

  const openPurchase = (need) => {
    const remaining = getRemaining(need)

    if (!need.allowPurchase || remaining <= 0) {
      return
    }

    setSelectedNeed(need)
    setPurchaseQuantity('1')
    setError('')
  }

  const closePurchase = () => {
    if (purchaseBusy) return

    setSelectedNeed(null)
    setPurchaseQuantity('1')
  }

  const submitPurchase = async () => {
    if (!selectedNeed) return

    const remaining = getRemaining(selectedNeed)
    const quantity = Number(purchaseQuantity)

    if (!Number.isInteger(quantity) || quantity < 1) {
      setError('Enter a valid quantity.')
      return
    }

    if (quantity > remaining) {
      setError(`Maximum available quantity is ${remaining}.`)
      return
    }

    try {
      setPurchaseBusy(true)
      setError('')

      const response = await apiFetch(
        `/api/food-need-purchases/needs/${selectedNeed.id}`,
        {
          method: 'POST',
          body: JSON.stringify({
            quantity
          })
        }
      )

      if (!response.ok) {
        const message = await response.text()
        throw new Error(
          message || 'Unable to submit purchase request'
        )
      }

      setSelectedNeed(null)
      setPurchaseQuantity('1')

      await loadFoodNeeds()
    } catch (err) {
      console.error('Purchase request failed:', err)
      setError(
        err.message || 'Unable to submit purchase request'
      )
    } finally {
      setPurchaseBusy(false)
    }
  }
  const [restaurant, setRestaurant] = useState(null)
  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const response = await apiFetch('/api/restaurants/my-profile')

        if (response.ok) {
          const data = await response.json()
          setRestaurant(data)
        }
      } catch (error) {
        console.error('Unable to load restaurant profile:', error)
      }
    }

    loadRestaurant()
  }, [])
  const restaurantName = restaurant?.restaurantName || 'Restaurant'

  const sidebar = (
    <aside className="rest-sidebar">
      <div className="rest-brand">
        <div className="rest-brand-icon">🍽</div>

        <div>
          <strong>FoodRescue</strong>
          <span>Restaurant Panel</span>
        </div>
      </div>

      <div className="rest-nav-title">Main Menu</div>

      <nav className="rest-nav">
        <button
          className={`rest-nav-item${
            isActive('/restaurant-dashboard') ? ' active' : ''
          }`}
          onClick={() => navigate('/restaurant-dashboard')}
        >
          <span className="rest-nav-icon">⌂</span>
          Dashboard
        </button>

        <button
          className={`rest-nav-item${
            isActive('/add-food') ? ' active' : ''
          }`}
          onClick={() => navigate('/add-food')}
        >
          <span className="rest-nav-icon">+</span>
          Add Food
        </button>

        <button
          className={`rest-nav-item${
            isActive('/my-food') ? ' active' : ''
          }`}
          onClick={() => navigate('/my-food')}
        >
          <span className="rest-nav-icon">▤</span>
          My Listings
        </button>

        <button
          className={`rest-nav-item${
            isActive('/restaurant/food-needs') ? ' active' : ''
          }`}
          onClick={() => navigate('/restaurant/food-needs')}
        >
          <span className="rest-nav-icon">♡</span>
          NGO Food Needs
        </button>

        <button
          className={`rest-nav-item${
            isActive('/restaurant-profile') ? ' active' : ''
          }`}
          onClick={() => navigate('/restaurant-profile')}
        >
          <span className="rest-nav-icon">☆</span>
          Profile
        </button>
      </nav>

      <div className="rest-sidebar-bottom">
        <div className="rest-profile">
          <div className="rest-avatar">
            {restaurantName.charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>{restaurantName}</strong>
            <span>Restaurant</span>
          </div>
        </div>

        <button className="rest-logout" onClick={handleLogout}>
          <span>↪</span>
          Logout
        </button>
      </div>
    </aside>
  )

  return (
    <div className="rest-layout">
      {sidebar}

      <main className="rest-main">
        <header className="rest-topbar">
          <div>
            <h1>NGO Food Needs</h1>
            <p>
              Support verified NGOs with the food they currently need.
            </p>
          </div>

          <div className="rest-online">
            <span className="rest-online-dot"></span>
            Restaurant
          </div>
        </header>

        <section className="rest-need-intro">
          <div>
            <span className="rest-section-label">
              COMMUNITY SUPPORT
            </span>

            <h2>Current NGO Food Needs</h2>

            <p>
              Browse open requirements from NGOs and help fulfill
              their food needs.
            </p>
          </div>

          <button
            className="rest-btn-secondary"
            onClick={loadFoodNeeds}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </section>

        {error && !selectedNeed && (
          <div className="rest-need-error">
            <span>!</span>
            <div>
              <strong>Unable to load food needs</strong>
              <p>{error}</p>
            </div>

            <button
              onClick={loadFoodNeeds}
              className="rest-btn-secondary"
            >
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="rest-loading">
            <div className="rest-loading-inner">
              <div className="rest-spinner" />
              <span>Loading NGO food needs...</span>
            </div>
          </div>
        ) : needs.length === 0 ? (
          <div className="rest-panel rest-need-empty">
            <div className="rest-need-empty-icon">♡</div>
            <h2>No open food needs</h2>
            <p>
              There are currently no open food requirements from
              verified NGOs.
            </p>
          </div>
        ) : (
          <section className="rest-needs-grid">
            {needs.map((need) => {
              const remaining = getRemaining(need)

              return (
                <article
                  className="rest-need-card"
                  key={need.id}
                >
                  <div className="rest-need-card-top">
                    <div>
                      <span className="rest-section-label">
                        NGO FOOD REQUEST
                      </span>

                      <h3>
                        {need.foodType || 'Food Requirement'}
                      </h3>
                    </div>

                    <span
                      className={`rest-need-urgency ${getUrgencyClass(
                        need.urgency
                      )}`}
                    >
                      {need.urgency || 'NORMAL'}
                    </span>
                  </div>

                  <div className="rest-need-summary">
                    <div>
                      <span>QUANTITY NEEDED</span>
                      <strong>
                        {need.quantityNeeded ?? '—'}
                      </strong>
                    </div>

                    <div>
                      <span>REMAINING</span>
                      <strong>{remaining}</strong>
                    </div>
                  </div>

                  <div className="rest-need-details">
                    <div>
                      <span>NEEDED BY</span>
                      <strong>
                        {formatDate(need.neededBy)}
                      </strong>
                    </div>

                    <div>
                      <span>LOCATION</span>
                      <strong>
                        {need.location || 'Not specified'}
                      </strong>
                    </div>

                    <div>
                      <span>FULFILLED</span>
                      <strong>
                        {need.quantityFulfilled ?? 0}
                      </strong>
                    </div>

                    <div>
                      <span>PURCHASE</span>
                      <strong
                        className={
                          need.allowPurchase
                            ? 'rest-purchase-yes'
                            : 'rest-purchase-no'
                        }
                      >
                        {need.allowPurchase
                          ? 'Allowed'
                          : 'Donation Only'}
                      </strong>
                    </div>
                  </div>

                  <div className="rest-need-card-footer">
                    {need.allowPurchase && remaining > 0 ? (
                      <button
                        className="rest-btn-primary rest-need-purchase-btn"
                        onClick={() => openPurchase(need)}
                      >
                        Purchase Food
                        <span>→</span>
                      </button>
                    ) : (
                      <div className="rest-need-disabled">
                        {remaining <= 0
                          ? 'Requirement Fulfilled'
                          : 'Donation Only'}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </section>
        )}

        {selectedNeed && (
          <div
            className="rest-need-modal-backdrop"
            onMouseDown={closePurchase}
          >
            <div
              className="rest-need-modal"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="rest-need-modal-header">
                <div>
                  <span className="rest-section-label">
                    PURCHASE FOOD
                  </span>

                  <h2>
                    {selectedNeed.foodType ||
                      'Food Requirement'}
                  </h2>

                  <p>
                    Submit a purchase request for this NGO
                    requirement.
                  </p>
                </div>

                <button
                  className="rest-need-modal-close"
                  onClick={closePurchase}
                  disabled={purchaseBusy}
                >
                  ×
                </button>
              </div>

              <div className="rest-need-modal-info">
                <div>
                  <span>REMAINING</span>
                  <strong>
                    {getRemaining(selectedNeed)}
                  </strong>
                </div>

                <div>
                  <span>NEEDED BY</span>
                  <strong>
                    {formatDate(selectedNeed.neededBy)}
                  </strong>
                </div>
              </div>

              <label className="rest-need-quantity-label">
                Quantity to Purchase

                <input
                  type="number"
                  min="1"
                  max={getRemaining(selectedNeed)}
                  value={purchaseQuantity}
                  onChange={(event) =>
                    setPurchaseQuantity(event.target.value)
                  }
                />
              </label>

              {error && (
                <div className="rest-need-modal-error">
                  {error}
                </div>
              )}

              <div className="rest-need-modal-actions">
                <button
                  className="rest-btn-secondary"
                  onClick={closePurchase}
                  disabled={purchaseBusy}
                >
                  Cancel
                </button>

                <button
                  className="rest-btn-primary"
                  onClick={submitPurchase}
                  disabled={purchaseBusy}
                >
                  {purchaseBusy
                    ? 'Submitting...'
                    : 'Submit Purchase'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default RestaurantFoodNeeds