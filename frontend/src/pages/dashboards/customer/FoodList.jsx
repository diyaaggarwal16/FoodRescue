import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { apiFetch } from '../../../utils/api'

function FoodList() {
  const [foodItems, setFoodItems] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedFood, setSelectedFood] = useState(null)
  const [showConfirmation, setShowConfirmation] =
    useState(false)

  const [quantity, setQuantity] = useState(1)

  const [fulfillmentType, setFulfillmentType] =
    useState('SELF_PICKUP')

  const [message, setMessage] = useState('')
  const [reserving, setReserving] = useState(false)

  const [reservationSummary, setReservationSummary] =
    useState(null)

  const [filter, setFilter] = useState('ALL')

  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  )

  const userName =
    user.fullName ||
    user.name ||
    user.email?.split('@')[0] ||
    'Customer'

  const loadFood = async () => {
    try {
      setLoading(true)
      setMessage('')

      const response = await apiFetch('/api/food')

      if (!response.ok) {
        throw new Error(
          'Failed to load food listings'
        )
      }

      const data = await response.json()

      setFoodItems(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (error) {
      setMessage(
        error.message ||
          'Unable to load food listings'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFood()
  }, [])

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

  const getFoodType = (food) => {
    return food.foodType || 'SURPLUS'
  }

  const filteredFood = useMemo(() => {
    if (filter === 'AVAILABLE') {
      return foodItems.filter(
        (food) =>
          Number(
            food.remainingQuantity || 0
          ) > 0
      )
    }

    if (filter === 'TODAY') {
      const today = new Date()

      return foodItems.filter((food) => {
        if (!food.pickupDeadline) {
          return false
        }

        const date = new Date(
          food.pickupDeadline
        )

        return (
          date.getDate() ===
            today.getDate() &&
          date.getMonth() ===
            today.getMonth() &&
          date.getFullYear() ===
            today.getFullYear()
        )
      })
    }

    return foodItems
  }, [foodItems, filter])

  const openReservation = (food) => {
    setSelectedFood(food)
    setQuantity(1)
    setFulfillmentType('SELF_PICKUP')
    setShowConfirmation(false)
    setMessage('')
  }

  const closeReservation = () => {
    if (reserving) {
      return
    }

    setSelectedFood(null)
    setShowConfirmation(false)
    setQuantity(1)
    setFulfillmentType('SELF_PICKUP')
    setMessage('')
  }

  const closeSuccessModal = () => {
    setReservationSummary(null)
    setMessage('')
  }

  const handleQuantityChange = (event) => {
    const value = Number(
      event.target.value
    )

    if (!Number.isFinite(value)) {
      setQuantity(1)
      return
    }

    if (value < 1) {
      setQuantity(1)
      return
    }

    if (
      selectedFood &&
      value >
        Number(
          selectedFood.remainingQuantity
        )
    ) {
      setQuantity(
        Number(
          selectedFood.remainingQuantity
        )
      )
      return
    }

    setQuantity(value)
  }

  const handleReservation = async () => {
    if (!selectedFood) {
      return
    }

    const selectedQuantity =
      Number(quantity)

    if (
      !selectedQuantity ||
      selectedQuantity < 1
    ) {
      setMessage(
        'Please select a valid quantity'
      )
      return
    }

    if (
      selectedQuantity >
      Number(
        selectedFood.remainingQuantity
      )
    ) {
      setMessage(
        'Not enough food available'
      )
      return
    }

    setReserving(true)
    setMessage('')

    try {
      const response = await apiFetch(
        '/api/reservations',
        {
          method: 'POST',
          body: JSON.stringify({
            foodListingId:
              selectedFood.id,
            quantity:
              selectedQuantity,
            fulfillmentType
          })
        }
      )

      const text =
        await response.text()

      let data

      try {
        data = JSON.parse(text)
      } catch {
        data = text
      }

      if (!response.ok) {
        throw new Error(
          typeof data === 'string'
            ? data
            : 'Unable to reserve food'
        )
      }

      setReservationSummary({
        foodName:
          selectedFood.foodName,
        quantity:
          data.quantity,
        totalPrice:
          data.totalPrice,
        restaurantName:
          selectedFood.restaurantName,
        pickupDeadline:
          selectedFood.pickupDeadline,
        allergens:
          selectedFood.allergens,
        fulfillmentType
      })

      setSelectedFood(null)
      setShowConfirmation(false)
      setQuantity(1)
      setFulfillmentType('SELF_PICKUP')

      await loadFood()
    } catch (error) {
      setMessage(
        error.message ||
          'Unable to reserve food'
      )
    } finally {
      setReserving(false)
    }
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
            className="customer-navigation-item active"
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
                FOOD MARKETPLACE
              </span>

              <h1>
                Explore surplus food.
              </h1>

              <p>
                Discover affordable meals from
                local restaurants before they go
                to waste.
              </p>
            </div>

            

          </div>

          
          <section className="customer-marketplace-toolbar">

            <div>
              <span>
                AVAILABLE FOOD
              </span>

              <h2>
                Browse Listings
              </h2>
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
                All Food
              </button>

              <button
                type="button"
                className={
                  filter === 'AVAILABLE'
                    ? 'customer-filter active'
                    : 'customer-filter'
                }
                onClick={() =>
                  setFilter('AVAILABLE')
                }
              >
                Available Now
              </button>

              <button
                type="button"
                className={
                  filter === 'TODAY'
                    ? 'customer-filter active'
                    : 'customer-filter'
                }
                onClick={() =>
                  setFilter('TODAY')
                }
              >
                Pickup Today
              </button>

            </div>

          </section>

          {message &&
            !selectedFood &&
            !reservationSummary && (
              <div className="customer-alert">
                {message}
              </div>
            )}

          {loading ? (

            <div className="customer-empty-card">

              <div className="customer-loader"></div>

              <span>
                Loading available food...
              </span>

            </div>

          ) : filteredFood.length === 0 ? (

            <div className="customer-empty-card">

              <div className="customer-empty-icon">
                F
              </div>

              <h3>
                No food listings found
              </h3>

              <p>
                Try another filter or check again
                later.
              </p>

            </div>

          ) : (

            <div className="customer-marketplace-grid">

              {filteredFood.map((food) => {

                const remaining =
                  Number(
                    food.remainingQuantity || 0
                  )

                const soldOut =
                  remaining <= 0

                return (
                  <article
                    className="customer-marketplace-card"
                    key={food.id}
                  >

                    <div className="customer-marketplace-image">

                      <span>
                        FOODRESCUE
                      </span>

                      <small>
                        {getFoodType(food)}
                      </small>

                      <b>
                        {soldOut
                          ? 'SOLD OUT'
                          : 'AVAILABLE'}
                      </b>

                    </div>

                    <div className="customer-marketplace-body">

                      <div className="customer-marketplace-heading">

                        <div>
                          <h3>
                            {food.foodName}
                          </h3>

                          <span>
                            {food.restaurantName ||
                              'Restaurant'}
                          </span>
                        </div>

                        <div>
                          <strong>
                            ₹{food.rescuePrice}
                          </strong>

                          {food.originalPrice && (
                            <small>
                              ₹{food.originalPrice}
                            </small>
                          )}
                        </div>

                      </div>

                      <p>
                        {food.description ||
                          'Fresh surplus food available for reservation.'}
                      </p>

                      <div className="customer-marketplace-details">

                        <div>
                          <span>
                            AVAILABLE
                          </span>

                          <strong>
                            {remaining}
                          </strong>
                        </div>

                        <div>
                          <span>
                            PICKUP BEFORE
                          </span>

                          <strong>
                            {formatPickupTime(
                              food.pickupDeadline
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            ALLERGENS
                          </span>

                          <strong>
                            {food.allergens ||
                              'None'}
                          </strong>
                        </div>

                      </div>

                      <button
                        type="button"
                        className="customer-card-button"
                        onClick={() =>
                          openReservation(food)
                        }
                        disabled={soldOut}
                      >
                        {soldOut
                          ? 'Sold Out'
                          : 'Reserve Food'}

                        {!soldOut && (
                          <b>
                            →
                          </b>
                        )}
                      </button>

                    </div>

                  </article>
                )
              })}

            </div>

          )}

        </main>

      </div>

      {selectedFood &&
        !showConfirmation && (

          <div className="customer-modal-overlay">

            <div className="customer-modal">

              <div className="customer-modal-header">

                <span>
                  RESERVATION
                </span>

                <h2>
                  Reserve Food
                </h2>

                <p>
                  {selectedFood.foodName}
                </p>

              </div>

              <div className="customer-modal-details">

                <div>
                  <span>
                    Restaurant
                  </span>
                  <strong>
                    {selectedFood.restaurantName ||
                      'Restaurant'}
                  </strong>
                </div>

                <div>
                  <span>
                    Available
                  </span>
                  <strong>
                    {selectedFood.remainingQuantity}
                  </strong>
                </div>

                <div>
                  <span>
                    Price
                  </span>
                  <strong>
                    ₹{selectedFood.rescuePrice}
                  </strong>
                </div>

                <div>
                  <span>
                    Pickup Before
                  </span>
                  <strong>
                    {formatPickupTime(
                      selectedFood.pickupDeadline
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Allergens
                  </span>
                  <strong>
                    {selectedFood.allergens ||
                      'None'}
                  </strong>
                </div>

              </div>

              <div className="customer-form">

                <label>
                  Quantity

                  <input
                    type="number"
                    min="1"
                    max={
                      selectedFood.remainingQuantity
                    }
                    value={quantity}
                    onChange={
                      handleQuantityChange
                    }
                  />
                </label>

                <label>
                  Fulfillment

                  <select
                    value={fulfillmentType}
                    onChange={(event) =>
                      setFulfillmentType(
                        event.target.value
                      )
                    }
                  >
                    <option value="SELF_PICKUP">
                      Pick up for myself
                    </option>

                    <option value="PAY_FORWARD">
                      Pay it forward to an NGO
                    </option>
                  </select>
                </label>

              </div>

              {message && (
                <p className="customer-modal-error">
                  {message}
                </p>
              )}

              <div className="customer-modal-actions">

                <button
                  type="button"
                  className="customer-modal-primary"
                  onClick={() =>
                    setShowConfirmation(true)
                  }
                >
                  Continue
                </button>

                <button
                  type="button"
                  className="customer-modal-secondary"
                  onClick={
                    closeReservation
                  }
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )}

      {showConfirmation &&
        selectedFood && (

          <div className="customer-modal-overlay">

            <div className="customer-modal">

              <div className="customer-modal-header">

                <span>
                  FINAL STEP
                </span>

                <h2>
                  Confirm Reservation
                </h2>

                <p>
                  Review your reservation details.
                </p>

              </div>

              <div className="customer-confirmation">

                <div>
                  <span>
                    Food
                  </span>
                  <strong>
                    {selectedFood.foodName}
                  </strong>
                </div>

                <div>
                  <span>
                    Restaurant
                  </span>
                  <strong>
                    {selectedFood.restaurantName ||
                      'Restaurant'}
                  </strong>
                </div>

                <div>
                  <span>
                    Quantity
                  </span>
                  <strong>
                    {quantity}
                  </strong>
                </div>

                <div>
                  <span>
                    Total
                  </span>
                  <strong>
                    ₹
                    {Number(quantity) *
                      Number(
                        selectedFood.rescuePrice ||
                          0
                      )}
                  </strong>
                </div>

                <div>
                  <span>
                    Pickup Before
                  </span>
                  <strong>
                    {formatPickupTime(
                      selectedFood.pickupDeadline
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Allergens
                  </span>
                  <strong>
                    {selectedFood.allergens ||
                      'None'}
                  </strong>
                </div>

                <div>
                  <span>
                    Fulfillment
                  </span>
                  <strong>
                    {fulfillmentType ===
                    'SELF_PICKUP'
                      ? 'Pick up for myself'
                      : 'Pay it forward to an NGO'}
                  </strong>
                </div>

              </div>

              {message && (
                <p className="customer-modal-error">
                  {message}
                </p>
              )}

              <div className="customer-modal-actions">

                <button
                  type="button"
                  className="customer-modal-primary"
                  onClick={
                    handleReservation
                  }
                  disabled={reserving}
                >
                  {reserving
                    ? 'Reserving...'
                    : 'Confirm Reservation'}
                </button>

                <button
                  type="button"
                  className="customer-modal-secondary"
                  onClick={() =>
                    setShowConfirmation(false)
                  }
                  disabled={reserving}
                >
                  Go Back
                </button>

              </div>

            </div>

          </div>

        )}

      {reservationSummary && (

        <div className="customer-modal-overlay">

          <div className="customer-modal customer-success-modal">

            <div className="customer-success-icon">
              ✓
            </div>

            <div className="customer-modal-header">

              <span>
                SUCCESS
              </span>

              <h2>
                Reservation Confirmed
              </h2>

              <p>
                Your surplus meal has been reserved.
              </p>

            </div>

            <div className="customer-confirmation">

              <div>
                <span>
                  Food
                </span>
                <strong>
                  {reservationSummary.foodName}
                </strong>
              </div>

              <div>
                <span>
                  Restaurant
                </span>
                <strong>
                  {reservationSummary.restaurantName}
                </strong>
              </div>

              <div>
                <span>
                  Quantity
                </span>
                <strong>
                  {reservationSummary.quantity}
                </strong>
              </div>

              <div>
                <span>
                  Total
                </span>
                <strong>
                  ₹{reservationSummary.totalPrice}
                </strong>
              </div>

              <div>
                <span>
                  Pickup Before
                </span>
                <strong>
                  {formatPickupTime(
                    reservationSummary.pickupDeadline
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Allergens
                </span>
                <strong>
                  {reservationSummary.allergens ||
                    'None'}
                </strong>
              </div>

            </div>

            <button
              type="button"
              className="customer-modal-primary full"
              onClick={
                closeSuccessModal
              }
            >
              Done
            </button>

          </div>

        </div>

      )}

    </div>
  )
}

export default FoodList