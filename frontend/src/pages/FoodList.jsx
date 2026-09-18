import { useEffect, useState } from 'react'
import { apiFetch } from '../utils/api'

function FoodList() {
  const [foodItems, setFoodItems] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedFood, setSelectedFood] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [fulfillmentType, setFulfillmentType] =
  useState('SELF_PICKUP')

  const [message, setMessage] = useState('')
  const [reserving, setReserving] = useState(false)
  const [reservationSummary, setReservationSummary] =
    useState(null)

  const loadFood = async () => {
    try {
      setLoading(true)

      const response = await apiFetch('/api/food')

      if (!response.ok) {
        throw new Error('Failed to load food listings')
      }

      const data = await response.json()
      setFoodItems(data)
    } catch (error) {
      setMessage(
        error.message || 'Unable to load food listings'
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
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  const openReservation = (food) => {
  setSelectedFood(food)
  setQuantity(1)
  setFulfillmentType('SELF_PICKUP')
  setMessage('')
  setShowConfirmation(false)
}

  const closeReservation = () => {
    if (reserving) {
      return
    }

    setSelectedFood(null)
    setShowConfirmation(false)
    setQuantity(1)
    setMessage('')
  }

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value)

    if (value < 1) {
      setQuantity(1)
      return
    }

    if (
      selectedFood &&
      value > selectedFood.remainingQuantity
    ) {
      setQuantity(selectedFood.remainingQuantity)
      return
    }

    setQuantity(value)
  }

  const handleReservation = async (event) => {
    event.preventDefault()

    if (!selectedFood) {
      return
    }

    const selectedQuantity = Number(quantity)

    if (
      !selectedQuantity ||
      selectedQuantity < 1
    ) {
      setMessage('Please select a valid quantity')
      return
    }

    if (
      selectedQuantity >
      selectedFood.remainingQuantity
    ) {
      setMessage('Not enough food available')
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
  foodListingId: selectedFood.id,
  quantity: selectedQuantity,
  fulfillmentType: fulfillmentType
})
        }
      )

      const text = await response.text()

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
        foodName: selectedFood.foodName,
        quantity: data.quantity,
        totalPrice: data.totalPrice,
        restaurantName:
          selectedFood.restaurantName,
        pickupDeadline:
          selectedFood.pickupDeadline
      })

      setSelectedFood(null)
      setShowConfirmation(false)
      setQuantity(1)

      await loadFood()
    } catch (error) {
      setMessage(
        error.message || 'Unable to reserve food'
      )
    } finally {
      setReserving(false)
    }
  }

  return (
    <div className="food-page">
      <div className="food-header">
        <h1>Explore Surplus Food</h1>

        <p>
          Find affordable food before it goes to waste.
        </p>
      </div>

      {message && !selectedFood && (
        <p className="auth-message">
          {message}
        </p>
      )}

      {loading ? (
        <p>Loading food...</p>
      ) : foodItems.length === 0 ? (
        <div className="food-card">
          <div className="food-content">
            <h2>No food listings available</h2>

            <p>
              New surplus food listings will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="food-grid">
          {foodItems.map((food) => (
            <div
              className="food-card"
              key={food.id}
            >
              <div className="food-image">
                FoodRescue
              </div>

              <div className="food-content">
                <h2>{food.foodName}</h2>

                <p>{food.description}</p>

                <p className="restaurant-name">
                  {food.restaurantName}
                </p>

                <p className="quantity">
                  Available: {food.remainingQuantity}
                </p>

                <p className="pickup-time">
                  Pickup before:{' '}
                  {formatPickupTime(
                    food.pickupDeadline
                  )}
                </p>

                <p className="pickup-time">
                  Allergens:{' '}
                  {food.allergens || 'None'}
                </p>

                <div className="price">
                  <span>
                    ₹{food.originalPrice}
                  </span>

                  <strong>
                    ₹{food.rescuePrice}
                  </strong>
                </div>

                <button
                  className="reserve-btn"
                  onClick={() =>
                    openReservation(food)
                  }
                  disabled={
                    food.remainingQuantity === 0
                  }
                >
                  {food.remainingQuantity === 0
                    ? 'Sold Out'
                    : 'Reserve Food'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFood && !showConfirmation && (
        <div className="reservation-overlay">
          <div className="reservation-modal">
            <div className="auth-header">
              <h1>Reserve Food</h1>

              <p>
                {selectedFood.foodName}
              </p>
            </div>

            <div className="reservation-summary">
              <p>
                Restaurant:{' '}
                {selectedFood.restaurantName}
              </p>

              <p>
                Available:{' '}
                {selectedFood.remainingQuantity}
              </p>

              <p>
                Price per item: ₹
                {selectedFood.rescuePrice}
              </p>

              <p>
                Pickup before:{' '}
                {formatPickupTime(
                  selectedFood.pickupDeadline
                )}
              </p>

              <p>
                Allergens:{' '}
                {selectedFood.allergens || 'None'}
              </p>
            </div>

            <form
              className="auth-form"
              onSubmit={(event) => {
                event.preventDefault()
                setShowConfirmation(true)
                setMessage('')
              }}
            >
              <div className="input-group">
                <label>Quantity</label>

                <input
                  type="number"
                  min="1"
                  max={
                    selectedFood.remainingQuantity
                  }
                  value={quantity}
                  onChange={handleQuantityChange}
                  required
                />
              </div>
              <div className="input-group">
  <label>What would you like to do?</label>

  <select
    value={fulfillmentType}
    onChange={(event) =>
      setFulfillmentType(event.target.value)
    }
  >
    <option value="SELF_PICKUP">
      Pick up for myself
    </option>

    <option value="PAY_FORWARD">
      Pay it forward to an NGO
    </option>
  </select>
</div>

              <button
                type="submit"
                className="auth-btn"
              >
                Continue
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={closeReservation}
              >
                Cancel
              </button>

              {message && (
                <p className="auth-message">
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {showConfirmation && selectedFood && (
        <div className="reservation-overlay">
          <div className="reservation-modal">
            <div className="auth-header">
              <h1>Confirm Reservation</h1>

              <p>
                Please verify your reservation details.
              </p>
            </div>

            <div className="reservation-summary">
              <h2>
                {selectedFood.foodName}
              </h2>

              <p>
                Restaurant:{' '}
                {selectedFood.restaurantName}
              </p>

              <p>
                Quantity: {quantity}
              </p>

              <p>
                Price per item: ₹
                {selectedFood.rescuePrice}
              </p>

              <p>
                Total Price: ₹
                {Number(quantity) *
                  Number(
                    selectedFood.rescuePrice
                  )}
              </p>

              <p>
                Pickup before:{' '}
                {formatPickupTime(
                  selectedFood.pickupDeadline
                )}
              </p>

              <p>
                Allergens:{' '}
                {selectedFood.allergens || 'None'}
              </p>
              <p>
  Fulfillment:{' '}
  {fulfillmentType === 'SELF_PICKUP'
    ? 'Pick up for myself'
    : 'Pay it forward to an NGO'}
</p>
            </div>

            <button
              type="button"
              className="auth-btn"
              onClick={handleReservation}
              disabled={reserving}
            >
              {reserving
                ? 'Reserving...'
                : 'Confirm Reservation'}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                setShowConfirmation(false)
              }
              disabled={reserving}
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {reservationSummary && (
        <div className="reservation-overlay">
          <div className="reservation-modal">
            <div className="auth-header">
              <h1>
                Reservation Successful
              </h1>

              <p>
                Your food has been reserved
                successfully.
              </p>
            </div>

            <div className="reservation-summary">
              <h2>
                {reservationSummary.foodName}
              </h2>

              <p>
                Restaurant:{' '}
                {reservationSummary.restaurantName}
              </p>

              <p>
                Quantity:{' '}
                {reservationSummary.quantity}
              </p>

              <p>
                Total Price: ₹
                {reservationSummary.totalPrice}
              </p>

              <p>
                Pickup before:{' '}
                {formatPickupTime(
                  reservationSummary.pickupDeadline
                )}
              </p>
            </div>

            <button
              className="auth-btn"
              onClick={() =>
                setReservationSummary(null)
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