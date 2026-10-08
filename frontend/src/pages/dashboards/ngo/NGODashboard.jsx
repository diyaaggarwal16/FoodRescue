import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../../../utils/api'
import '../../../styles/ngo.css'

function NGODashboard() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [availableMeals, setAvailableMeals] = useState([])
  const [claimedMeals, setClaimedMeals] = useState([])
  const [foodNeeds, setFoodNeeds] = useState([])
  const [purchaseRequests, setPurchaseRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const [foodType, setFoodType] = useState('')
  const [quantityNeeded, setQuantityNeeded] = useState('')
  const [neededBy, setNeededBy] = useState('')
  const [location, setLocation] = useState('')
  const [urgency, setUrgency] = useState('NORMAL')
  const [allowPurchase, setAllowPurchase] = useState(false)
  const [creatingNeed, setCreatingNeed] = useState(false)

  const [fulfillNeedId, setFulfillNeedId] = useState('')
  const [fulfillQuantity, setFulfillQuantity] = useState('')
  const [fulfillMealId, setFulfillMealId] = useState('')

  const loadDashboard = async () => {
    try {
      setLoading(true)

      const [
        profileResponse,
        availableResponse,
        claimedResponse,
        needsResponse,
        purchasesResponse
      ] = await Promise.all([
        apiFetch('/api/ngos/my-profile'),
        apiFetch('/api/donated-meals/available'),
        apiFetch('/api/donated-meals/my-claimed'),
        apiFetch('/api/food-needs/my'),
        apiFetch('/api/food-need-purchases/incoming')
      ])

      if (profileResponse.ok) {
        setProfile(await profileResponse.json())
      } else {
        setProfile(null)
      }

      if (availableResponse.ok) {
        setAvailableMeals(
          await availableResponse.json()
        )
      } else {
        setAvailableMeals([])
      }

      if (claimedResponse.ok) {
        setClaimedMeals(
          await claimedResponse.json()
        )
      } else {
        setClaimedMeals([])
      }

      if (needsResponse.ok) {
        setFoodNeeds(
          await needsResponse.json()
        )
      } else {
        setFoodNeeds([])
      }

      if (purchasesResponse.ok) {
        setPurchaseRequests(await purchasesResponse.json())
      } else {
        setPurchaseRequests([])
      }
    } catch (error) {
      console.error(error)
      setMessage(
        'Unable to load NGO dashboard'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const claimMeal = async mealId => {
    try {
      setMessage('')

      const response = await apiFetch(
        `/api/donated-meals/${mealId}/claim`,
        {
          method: 'PUT'
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(
          data || 'Unable to claim meal'
        )
        return
      }

      setMessage(
        'Meal claimed successfully'
      )

      await loadDashboard()
    } catch (error) {
      console.error(error)
      setMessage('Unable to claim meal')
    }
  }

  const createFoodNeed = async event => {
    event.preventDefault()

    try {
      setCreatingNeed(true)
      setMessage('')

      const response = await apiFetch(
        '/api/food-needs',
        {
          method: 'POST',
          body: JSON.stringify({
            foodType,
            quantityNeeded: Number(
              quantityNeeded
            ),
            neededBy,
            location,
            urgency,
            allowPurchase
          })
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(
          data || 'Unable to create food need'
        )
        return
      }

      setMessage(
        'Food need created successfully'
      )

      setFoodType('')
      setQuantityNeeded('')
      setNeededBy('')
      setLocation('')
      setUrgency('NORMAL')
      setAllowPurchase(false)

      await loadDashboard()
    } catch (error) {
      console.error(error)
      setMessage(
        'Unable to create food need'
      )
    } finally {
      setCreatingNeed(false)
    }
  }

  const fulfillNeed = async () => {
    if (
      !fulfillNeedId ||
      !fulfillMealId ||
      !fulfillQuantity ||
      Number(fulfillQuantity) <= 0
    ) {
      setMessage(
        'Please select a food need and enter a valid quantity'
      )
      return
    }

    try {
      setMessage('')

      const response = await apiFetch(
        `/api/food-need-fulfillments?foodNeedId=${fulfillNeedId}&donatedMealId=${fulfillMealId}&quantity=${Number(fulfillQuantity)}`,
        {
          method: 'POST'
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(
          data ||
            'Unable to fulfill food need'
        )
        return
      }

      setMessage(
        'Food need fulfilled successfully'
      )

      setFulfillNeedId('')
      setFulfillMealId('')
      setFulfillQuantity('')

      await loadDashboard()
    } catch (error) {
      console.error(error)
      setMessage(
        'Unable to fulfill food need'
      )
    }
  }

  const decidePurchase = async (purchaseId, decision) => {
    try {
      setMessage('')
      const response = await apiFetch(`/api/food-need-purchases/${purchaseId}/${decision}`, { method: 'PUT' })
      const body = await response.text()
      if (!response.ok) {
        setMessage(body || 'Unable to update purchase request')
        return
      }
      setMessage(`Purchase request ${decision === 'approve' ? 'approved' : 'rejected'}`)
      await loadDashboard()
    } catch (error) {
      console.error(error)
      setMessage('Unable to update purchase request')
    }
  }

  const formatDate = value => {
    if (!value) {
      return 'Not provided'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )
  }

  const isVerified =
    profile?.verificationStatus ===
    'VERIFIED'

  const openNeeds = foodNeeds.filter(
    need =>
      need.status === 'OPEN' ||
      need.status ===
        'PARTIALLY_FULFILLED'
  )

  const totalNeeded = foodNeeds.reduce(
    (total, need) =>
      total + Number(
        need.quantityNeeded || 0
      ),
    0
  )

  const totalFulfilled =
    foodNeeds.reduce(
      (total, need) =>
        total + Number(
          need.quantityFulfilled || 0
        ),
      0
    )

  if (loading) {
    return (
      <div className="ngo-dashboard-loading">
        <div className="ngo-dashboard-spinner"></div>
        <p>Loading NGO Dashboard...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="ngo-dashboard-empty-page">
        <div className="ngo-dashboard-empty-card">
          <div className="ngo-dashboard-empty-icon">
            ♡
          </div>

          <h1>NGO Profile Required</h1>

          <p>
            Please create your NGO profile
            before using NGO services.
          </p>

          <button
            className="ngo-dashboard-gradient-btn"
            onClick={() =>
              navigate('/ngo-profile')
            }
          >
            Create NGO Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ngo-dashboard-page">

      <main className="ngo-dashboard-container">

        <section className="ngo-dashboard-hero">

          <div className="ngo-dashboard-hero-glow blue"></div>
          <div className="ngo-dashboard-hero-glow pink"></div>

          <div className="ngo-dashboard-hero-left">

            <div className="ngo-dashboard-avatar">
              ♡
            </div>

            <div className="ngo-dashboard-hero-content">

              <div className="ngo-dashboard-eyebrow">
                ✦ NGO DASHBOARD
              </div>

              <h1>
                Welcome back,{' '}
                {profile.ngoName || 'NGO'}!
              </h1>

              <p>
                Together we can make a bigger
                impact.
              </p>

              <div className="ngo-dashboard-meta">

                <span>
                  ⌖ {profile.address ||
                    'Address not added'}
                </span>

                <span>
                  ☎ {profile.phone ||
                    'Phone not added'}
                </span>

                <span
                  className={
                    isVerified
                      ? 'verified'
                      : 'pending'
                  }
                >
                  ✓{' '}
                  {profile.verificationStatus ||
                    'PENDING'}
                </span>

              </div>

            </div>
          </div>

          <div className="ngo-dashboard-mission">
            <span>Making</span>
            <span>A Hunger Free</span>
            <span>Tomorrow</span>

            <div>
              <i></i>
              <b>♥</b>
              <i></i>
            </div>
          </div>

        </section>

        {message && (
          <div className="ngo-dashboard-message">
            <span>✓</span>
            {message}
          </div>
        )}

        <section className="ngo-dashboard-stats">

          <div className="ngo-dashboard-stat blue">
            <div className="ngo-dashboard-stat-icon">
              ♟
            </div>

            <div>
              <span>Available Meals</span>
              <strong>
                {availableMeals.length}
              </strong>
              <small>
                Meals ready to claim
              </small>
            </div>
          </div>

          <div className="ngo-dashboard-stat purple">
            <div className="ngo-dashboard-stat-icon">
              ♥
            </div>

            <div>
              <span>My Claimed Meals</span>
              <strong>
                {claimedMeals.length}
              </strong>
              <small>
                Meals claimed by your NGO
              </small>
            </div>
          </div>

          <div className="ngo-dashboard-stat pink">
            <div className="ngo-dashboard-stat-icon">
              ▣
            </div>

            <div>
              <span>Active Requests</span>
              <strong>
                {openNeeds.length}
              </strong>
              <small>
                Food needs awaiting fulfilment
              </small>
            </div>
          </div>

          <div className="ngo-dashboard-stat violet">
            <div className="ngo-dashboard-stat-icon">
              ★
            </div>

            <div>
              <span>Food Fulfilled</span>
              <strong>
                {totalFulfilled}
              </strong>
              <small>
                Of {totalNeeded} requested
              </small>
            </div>
          </div>

        </section>

        <section className="ngo-dashboard-grid">

          <div className="ngo-dashboard-panel">

            <div className="ngo-dashboard-panel-header">
              <div>
                <h2>Recent Food Requests</h2>
                <p>
                  Your latest food requirements
                </p>
              </div>

              <span>
                {foodNeeds.length}
              </span>
            </div>

            {foodNeeds.length === 0 ? (
              <div className="ngo-dashboard-no-data">
                No food requests yet.
              </div>
            ) : (
              <div className="ngo-dashboard-list">

                {foodNeeds
                  .slice(0, 4)
                  .map(need => (
                    <div
                      className="ngo-dashboard-list-row"
                      key={need.id}
                    >
                      <div className="ngo-dashboard-row-icon">
                        ▣
                      </div>

                      <div className="ngo-dashboard-row-main">
                        <strong>
                          {need.foodType}
                        </strong>

                        <span>
                          {need.location}
                        </span>
                      </div>

                      <div className="ngo-dashboard-row-value">
                        <strong>
                          {need.quantityNeeded}
                        </strong>

                        <span>
                          needed
                        </span>
                      </div>

                      <span className="ngo-dashboard-status">
                        {need.status}
                      </span>
                    </div>
                  ))}

              </div>
            )}

          </div>

          <div className="ngo-dashboard-panel">

            <div className="ngo-dashboard-panel-header">
              <div>
                <h2>Available Meals</h2>
                <p>
                  Latest meals from restaurants
                </p>
              </div>

              <span>
                {availableMeals.length}
              </span>
            </div>

            {availableMeals.length === 0 ? (
              <div className="ngo-dashboard-no-data">
                No donated meals available.
              </div>
            ) : (
              <div className="ngo-dashboard-list">

                {availableMeals
                  .slice(0, 4)
                  .map(meal => (
                    <div
                      className="ngo-dashboard-list-row"
                      key={meal.id}
                    >
                      <div className="ngo-dashboard-row-icon pink">
                        ♡
                      </div>

                      <div className="ngo-dashboard-row-main">
                        <strong>
                          {meal.foodName}
                        </strong>

                        <span>
                          {meal.restaurantName}
                        </span>
                      </div>

                      <div className="ngo-dashboard-row-value">
                        <strong>
                          {meal.quantity}
                        </strong>

                        <span>
                          portions
                        </span>
                      </div>

                      <button
                        className="ngo-dashboard-small-btn"
                        onClick={() =>
                          claimMeal(meal.id)
                        }
                        disabled={!isVerified}
                      >
                        Claim
                      </button>
                    </div>
                  ))}

              </div>
            )}

          </div>

        </section>

        <section className="ngo-dashboard-actions">

          <div>
            <div className="ngo-dashboard-action-icon">
              ⚡
            </div>

            <div>
              <h2>Quick Actions</h2>
              <p>
                Manage your NGO activities
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              document
                .getElementById(
                  'ngo-create-need'
                )
                ?.scrollIntoView({
                  behavior: 'smooth'
                })
            }
          >
            <span>▣</span>
            Create Food Need
            <b>→</b>
          </button>

          <button
            onClick={() =>
              document
                .getElementById(
                  'ngo-available-meals'
                )
                ?.scrollIntoView({
                  behavior: 'smooth'
                })
            }
          >
            <span>♡</span>
            View Meals
            <b>→</b>
          </button>

          <button
            onClick={() =>
              navigate('/ngo-profile')
            }
          >
            <span>♙</span>
            Update Profile
            <b>→</b>
          </button>

        </section>

        <section
          id="ngo-create-need"
          className="ngo-dashboard-form-panel"
        >

          <div className="ngo-dashboard-panel-header">
            <div>
              <h2>Create Food Need</h2>
              <p>
                Tell restaurants what your NGO
                currently needs.
              </p>
            </div>

            <span>
              {isVerified
                ? 'VERIFIED'
                : 'PENDING'}
            </span>
          </div>

          {!isVerified ? (
            <div className="ngo-dashboard-warning">
              Your NGO must be verified before
              creating food needs.
            </div>
          ) : (
            <form
              className="ngo-dashboard-form"
              onSubmit={createFoodNeed}
            >

              <div>
                <label>Food Type</label>
                <input
                  type="text"
                  value={foodType}
                  onChange={event =>
                    setFoodType(
                      event.target.value
                    )
                  }
                  placeholder="Example: Rice meals"
                  required
                />
              </div>

              <div>
                <label>Quantity Needed</label>
                <input
                  type="number"
                  min="1"
                  value={quantityNeeded}
                  onChange={event =>
                    setQuantityNeeded(
                      event.target.value
                    )
                  }
                  placeholder="Example: 50"
                  required
                />
              </div>

              <div>
                <label>Needed By</label>
                <input
                  type="datetime-local"
                  value={neededBy}
                  onChange={event =>
                    setNeededBy(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div>
                <label>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={event =>
                    setLocation(
                      event.target.value
                    )
                  }
                  placeholder="Example: Delhi"
                  required
                />
              </div>

              <div>
                <label>Urgency</label>
                <select
                  value={urgency}
                  onChange={event =>
                    setUrgency(
                      event.target.value
                    )
                  }
                >
                  <option value="LOW">
                    Low
                  </option>
                  <option value="NORMAL">
                    Normal
                  </option>
                  <option value="HIGH">
                    High
                  </option>
                  <option value="URGENT">
                    Urgent
                  </option>
                </select>
              </div>

              <label className="ngo-dashboard-checkbox">
                <input
                  type="checkbox"
                  checked={allowPurchase}
                  onChange={event =>
                    setAllowPurchase(
                      event.target.checked
                    )
                  }
                />
                Allow purchase if donation
                is unavailable
              </label>

              <button
                type="submit"
                className="ngo-dashboard-gradient-btn"
                disabled={creatingNeed}
              >
                {creatingNeed
                  ? 'Creating...'
                  : 'Create Food Need'}
              </button>

            </form>
          )}

        </section>

        <section className="ngo-dashboard-panel full">
          <div className="ngo-dashboard-panel-header">
            <div><h2>Incoming Food Need Purchases</h2><p>Review purchase requests for your food needs.</p></div>
            <span>{purchaseRequests.filter(request => request.status === 'PENDING').length} pending</span>
          </div>
          {purchaseRequests.length === 0 ? (
            <div className="ngo-dashboard-no-data">No purchase requests have arrived yet.</div>
          ) : (
            <div className="ngo-purchase-list">
              {purchaseRequests.slice().sort((a, b) => (b.id || 0) - (a.id || 0)).map(request => {
                const need = foodNeeds.find(item => item.id === request.foodNeedId)
                return <article className="ngo-purchase-row" key={request.id}>
                  <div className="ngo-purchase-main"><strong>{need?.foodType || `Food Need #${request.foodNeedId}`}</strong><span>{request.requesterRole} · Quantity {request.quantity}</span><small>{formatDate(request.createdAt)}</small></div>
                  <b className={`purchase-status ${String(request.status).toLowerCase()}`}>{request.status}</b>
                  {request.status === 'PENDING' && <div className="ngo-purchase-actions"><button type="button" disabled={!isVerified} onClick={() => decidePurchase(request.id, 'approve')}>Approve</button><button type="button" disabled={!isVerified} onClick={() => decidePurchase(request.id, 'reject')}>Reject</button></div>}
                </article>
              })}
            </div>
          )}
        </section>

        <section
          id="ngo-available-meals"
          className="ngo-dashboard-panel full"
        >

          <div className="ngo-dashboard-panel-header">
            <div>
              <h2>Available Donated Meals</h2>
              <p>
                Claim meals that are currently
                available for your NGO.
              </p>
            </div>

            <span>
              {availableMeals.length} meals
            </span>
          </div>

          {availableMeals.length === 0 ? (
            <div className="ngo-dashboard-no-data">
              No donated meals are currently
              available.
            </div>
          ) : (
            <div className="ngo-dashboard-meal-grid">

              {availableMeals.map(meal => (
                <div
                  className="ngo-dashboard-meal-card"
                  key={meal.id}
                >

                  <div className="ngo-dashboard-meal-top">
                    <div>
                      <span>DONATED MEAL</span>
                      <h3>
                        {meal.foodName}
                      </h3>
                    </div>

                    <b>
                      AVAILABLE
                    </b>
                  </div>

                  <p className="ngo-meal-restaurant">
                    {meal.restaurantName}
                  </p>

                  <div className="ngo-dashboard-meal-info">

                    <div>
                      <span>Quantity</span>
                      <strong>
                        {meal.quantity}
                      </strong>
                    </div>

                    <div>
                      <span>Pickup</span>
                      <strong>
                        {formatDate(
                          meal.pickupDeadline
                        )}
                      </strong>
                    </div>

                  </div>

                  {meal.allergens && (
                    <div className="ngo-dashboard-allergen">
                      Allergens:{' '}
                      {meal.allergens}
                    </div>
                  )}

                  <button
                    className="ngo-dashboard-gradient-btn"
                    onClick={() =>
                      claimMeal(meal.id)
                    }
                    disabled={!isVerified}
                  >
                    Claim Meal
                  </button>

                  {isVerified &&
                    openNeeds.length > 0 && (
                      <div className="ngo-dashboard-fulfill">

                        <label>
                          Fulfill Food Need
                        </label>

                        <select
                          value={
                            fulfillMealId ===
                            String(meal.id)
                              ? fulfillNeedId
                              : ''
                          }
                          onChange={event => {
                            setFulfillMealId(
                              String(meal.id)
                            )
                            setFulfillNeedId(
                              event.target.value
                            )
                          }}
                        >
                          <option value="">
                            Select food need
                          </option>

                          {openNeeds.map(
                            need => (
                              <option
                                key={need.id}
                                value={need.id}
                              >
                                {need.foodType}
                                {' — Remaining: '}
                                {Math.max(
                                  0,
                                  need.quantityNeeded -
                                    (need.quantityFulfilled || 0) -
                                    (need.quantityReserved || 0)
                                )}
                              </option>
                            )
                          )}
                        </select>

                        {fulfillMealId ===
                          String(meal.id) &&
                          fulfillNeedId && (
                            <div className="ngo-dashboard-fulfill-row">

                              <input
                                type="number"
                                min="1"
                                value={
                                  fulfillQuantity
                                }
                                onChange={event =>
                                  setFulfillQuantity(
                                    event.target.value
                                  )
                                }
                                placeholder="Qty"
                              />

                              <button
                                type="button"
                                onClick={
                                  fulfillNeed
                                }
                              >
                                Fulfill
                              </button>

                            </div>
                          )}

                      </div>
                    )}

                </div>
              ))}

            </div>
          )}

        </section>

        <section className="ngo-dashboard-panel full">

          <div className="ngo-dashboard-panel-header">
            <div>
              <h2>My Claimed Meals</h2>
              <p>
                Meals already claimed by your NGO.
              </p>
            </div>

            <span>
              {claimedMeals.length} claimed
            </span>
          </div>

          {claimedMeals.length === 0 ? (
            <div className="ngo-dashboard-no-data">
              You have not claimed any meals yet.
            </div>
          ) : (
            <div className="ngo-dashboard-meal-grid">

              {claimedMeals.map(meal => (
                <div
                  className="ngo-dashboard-meal-card"
                  key={meal.id}
                >

                  <div className="ngo-dashboard-meal-top">
                    <div>
                      <span>CLAIMED MEAL</span>
                      <h3>
                        {meal.foodName}
                      </h3>
                    </div>

                    <b>
                      {meal.status}
                    </b>
                  </div>

                  <p className="ngo-meal-restaurant">
                    {meal.restaurantName}
                  </p>

                  <div className="ngo-dashboard-meal-info">

                    <div>
                      <span>Quantity</span>
                      <strong>
                        {meal.quantity}
                      </strong>
                    </div>

                    <div>
                      <span>Pickup</span>
                      <strong>
                        {formatDate(
                          meal.pickupDeadline
                        )}
                      </strong>
                    </div>

                  </div>

                  {meal.allergens && (
                    <div className="ngo-dashboard-allergen">
                      Allergens:{' '}
                      {meal.allergens}
                    </div>
                  )}

                  {meal.status ===
                    'READY_FOR_PICKUP' &&
                    meal.pickupOtp && (
                      <div className="ngo-dashboard-otp">
                        <span>
                          PICKUP OTP
                        </span>

                        <strong>
                          {meal.pickupOtp}
                        </strong>

                        <p>
                          Show this OTP to the
                          restaurant during
                          pickup.
                        </p>
                      </div>
                    )}

                </div>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  )
}

export default NGODashboard
