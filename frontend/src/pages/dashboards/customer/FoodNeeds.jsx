import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../../utils/api'
import '../../../styles/customer.css'

function FoodNeeds() {
  const [needs, setNeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [purchases, setPurchases] = useState([])
  const [selectedNeed, setSelectedNeed] = useState(null)
  const [purchaseQuantity, setPurchaseQuantity] = useState('1')
  const [purchaseBusy, setPurchaseBusy] = useState(false)

  const loadFoodNeeds = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await apiFetch('/api/food-needs/open')

      if (!response.ok) {
        const message = await response.text()
        throw new Error(
          message || 'Unable to load food needs'
        )
      }

      const data = await response.json()

      setNeeds(Array.isArray(data) ? data : [])

      const purchaseResponse = await apiFetch('/api/food-need-purchases/my')
      if (purchaseResponse.ok) {
        const purchaseData = await purchaseResponse.json()
        setPurchases(Array.isArray(purchaseData) ? purchaseData : [])
      }
    } catch (err) {
      console.error('Unable to load food needs:', err)

      setError(
        err.message || 'Unable to load food needs'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFoodNeeds()
  }, [])

  const submitPurchase = async () => {
    if (!selectedNeed || Number(purchaseQuantity) < 1) return
    try {
      setPurchaseBusy(true)
      setError('')
      const response = await apiFetch(
        `/api/food-need-purchases/needs/${selectedNeed.id}`,
        { method: 'POST', body: JSON.stringify({ quantity: Number(purchaseQuantity) }) }
      )
      if (!response.ok) throw new Error(await response.text() || 'Unable to submit purchase request')
      setSelectedNeed(null)
      setPurchaseQuantity('1')
      await loadFoodNeeds()
    } catch (err) {
      setError(err.message || 'Unable to submit purchase request')
    } finally {
      setPurchaseBusy(false)
    }
  }

  const formatDate = (value) => {
    if (!value) {
      return 'Not specified'
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

  const getRemainingQuantity = (need) => {
    const needed = Number(need.quantityNeeded || 0)
    const fulfilled = Number(
      need.quantityFulfilled || 0
    )

    const reserved = Number(need.quantityReserved || 0)
    return Math.max(0, needed - fulfilled - reserved)
  }

  return (
    <div className="customer-app">
      <aside className="customer-sidebar">
        <div className="customer-brand">
          <div className="customer-brand-mark">
            F
          </div>

          <div>
            <strong>FoodRescue</strong>
            <span>CUSTOMER PANEL</span>
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
            <span>Dashboard</span>
          </Link>

          <Link
            to="/food"
            className="customer-navigation-item"
          >
            <span className="customer-navigation-icon">
              □
            </span>
            <span>Explore Food</span>
          </Link>

          <Link
            to="/food-needs"
            className="customer-navigation-item active"
          >
            <span className="customer-navigation-icon">
              ♡
            </span>
            <span>Food Needs</span>
          </Link>

          <Link
            to="/my-reservations"
            className="customer-navigation-item"
          >
            <span className="customer-navigation-icon">
              ▣
            </span>
            <span>My Reservations</span>
          </Link>
        </nav>

        <div className="customer-sidebar-footer">
          <Link
            to="/"
            className="customer-back-link"
          >
            ← Back to Website
          </Link>
        </div>
      </aside>

      <div className="customer-main">
        <main className="customer-content">
          <div className="customer-page-header">
            <div>
              <span className="customer-page-eyebrow">
                COMMUNITY NEEDS
              </span>

              <h1>Food Needs</h1>

              <p>
                See what verified NGOs currently need
                and help reduce food insecurity.
              </p>
            </div>
          </div>

          <section className="customer-section">
            <div className="customer-section-header">
              <div>
                <span>NGO REQUESTS</span>

                <h2>Current Food Needs</h2>

                <p>
                  Verified NGOs looking for food
                  donations.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="customer-empty-card">
                <div className="customer-loader"></div>

                <span>
                  Loading food needs...
                </span>
              </div>
            ) : error ? (
              <div className="customer-empty-card">
                <div className="customer-empty-icon">
                  !
                </div>

                <h3>
                  Unable to load food needs
                </h3>

                <p>{error}</p>

                <button
                  type="button"
                  className="customer-primary-button"
                  onClick={loadFoodNeeds}
                >
                  Try Again
                </button>
              </div>
            ) : needs.length === 0 ? (
              <div className="customer-empty-card">
                <div className="customer-empty-icon">
                  F
                </div>

                <h3>
                  No food needs right now
                </h3>

                <p>
                  NGOs have not posted any open food
                  requirements yet.
                </p>
              </div>
            ) : (
              <div className="customer-food-grid">
                {needs.map((need) => {
                  const remainingQuantity =
                    getRemainingQuantity(need)

                  return (
                    <article
                      className="customer-food-card"
                      key={need.id}
                    >
                      <div className="customer-food-visual">
                        <span>FOODRESCUE</span>

                        <small>
                          NGO FOOD NEED
                        </small>
                      </div>

                      <div className="customer-food-body">
                        <div className="customer-food-heading">
                          <div>
                            <h3>
                              {need.foodType ||
                                'Food Requirement'}
                            </h3>

                            <span>
                              Verified NGO
                            </span>
                          </div>

                          <strong>
                            {need.quantityNeeded ??
                              '—'}
                          </strong>
                        </div>

                        <p>
                          This NGO has requested{' '}
                          {need.foodType ||
                            'food'}{' '}
                          support.
                        </p>

                        <div className="customer-food-meta">
                          <div>
                            <span>
                              QUANTITY NEEDED
                            </span>

                            <strong>
                              {need.quantityNeeded ??
                                '—'}
                            </strong>
                          </div>

                          <div>
                            <span>
                              REMAINING
                            </span>

                            <strong>
                              {remainingQuantity}
                            </strong>
                          </div>
                        </div>

                        <div className="customer-food-meta">
                          <div>
                            <span>
                              NEEDED BY
                            </span>

                            <strong>
                              {formatDate(
                                need.neededBy
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>
                              URGENCY
                            </span>

                            <strong>
                              {need.urgency ||
                                'NORMAL'}
                            </strong>
                          </div>
                        </div>

                        {need.location && (
                          <div className="customer-food-meta">
                            <div>
                              <span>
                                LOCATION
                              </span>

                              <strong>
                                {need.location}
                              </strong>
                            </div>
                          </div>
                        )}

                        <div className="customer-food-meta">
                          <div>
                            <span>
                              FULFILLED
                            </span>

                            <strong>
                              {need.quantityFulfilled ??
                                0}
                            </strong>
                          </div>

                          <div>
                            <span>
                              PURCHASE
                            </span>

                            <strong>
                              {need.allowPurchase
                                ? 'Allowed'
                                : 'Donation Only'}
                            </strong>
                          </div>
                        </div>

                        {need.allowPurchase && remainingQuantity > 0 ? (
                          <button type="button" className="customer-card-button" onClick={() => { setSelectedNeed(need); setPurchaseQuantity('1') }}>
                            Purchase <b>→</b>
                          </button>
                        ) : (
                          <div className="customer-card-button customer-card-button-disabled">
                            {remainingQuantity === 0 ? 'Fully Requested' : 'Donation Only'}
                          </div>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
          <section className="customer-section customer-purchases">
            <div className="customer-section-header"><div><span>YOUR ACTIVITY</span><h2>My Purchase Requests</h2><p>Track responses from NGOs.</p></div></div>
            {purchases.length === 0 ? <div className="customer-empty-card"><p>You have not submitted any purchase requests yet.</p></div> : (
              <div className="customer-purchase-list">
                {purchases.map(purchase => <article key={purchase.id} className="customer-purchase-row">
                  <strong>Food Need #{purchase.foodNeedId}</strong><span>Quantity: {purchase.quantity}</span><b className={`purchase-status ${String(purchase.status).toLowerCase()}`}>{purchase.status}</b>
                </article>)}
              </div>
            )}
          </section>
        </main>
      </div>
      {selectedNeed && (
        <div className="purchase-modal-backdrop" role="presentation" onClick={event => { if (event.target === event.currentTarget) setSelectedNeed(null) }}>
          <section className="purchase-modal" role="dialog" aria-modal="true" aria-labelledby="purchase-title">
            <h2 id="purchase-title">Purchase {selectedNeed.foodType}</h2>
            <p>Choose the quantity to request. The NGO will review it before it counts toward fulfillment.</p>
            <label htmlFor="purchase-quantity">Quantity (up to {getRemainingQuantity(selectedNeed)})</label>
            <input id="purchase-quantity" type="number" min="1" max={getRemainingQuantity(selectedNeed)} value={purchaseQuantity} onChange={event => setPurchaseQuantity(event.target.value)} />
            {error && <p className="purchase-modal-error">{error}</p>}
            <div className="purchase-modal-actions"><button type="button" onClick={() => setSelectedNeed(null)}>Cancel</button><button type="button" disabled={purchaseBusy || Number(purchaseQuantity) < 1 || Number(purchaseQuantity) > getRemainingQuantity(selectedNeed)} onClick={submitPurchase}>{purchaseBusy ? 'Submitting…' : 'Submit Request'}</button></div>
          </section>
        </div>
      )}
    </div>
  )
}

export default FoodNeeds
