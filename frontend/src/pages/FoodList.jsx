import { useEffect, useState } from 'react'

function FoodList() {
  const [foodItems, setFoodItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFood, setSelectedFood] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [message, setMessage] = useState('')
  const [reserving, setReserving] = useState(false)
  const [reservationSummary, setReservationSummary] = useState(null)
  

  const loadFood = () => {
    fetch('http://localhost:8080/api/food')
      .then((response) => response.json())
      .then((data) => {
        setFoodItems(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadFood()
  }, [])

  const openReservation = (food) => {
    setSelectedFood(food)
    setQuantity(1)
    setCustomerName('')
    setCustomerEmail('')
    setMessage('')
  }

  const closeReservation = () => {
    setSelectedFood(null)
    setMessage('')
  }

  const handleReservation = async (event) => {
    event.preventDefault()

    if (quantity > selectedFood.remainingQuantity) {
      setMessage('Not enough food available')
      return
    }

    setReserving(true)
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/reservations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            foodListingId: selectedFood.id,
            customerName,
            customerEmail,
            quantity: Number(quantity)
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data)
      }
      setReservationSummary({
  foodName: selectedFood.foodName,
  quantity: data.quantity,
  totalPrice: data.totalPrice,
  restaurantName: selectedFood.restaurantName,
  pickupDeadline: selectedFood.pickupDeadline
})

loadFood()

setSelectedFood(null)
      setMessage(
  `Reservation successful. Total price: ₹${data.totalPrice}`
)

loadFood()

setTimeout(() => {
  setSelectedFood(null)
  setMessage('')
}, 1500)

      



setSelectedFood(null)
loadFood()
    } catch (error) {
      setMessage(error.message || 'Unable to reserve food')
    } finally {
      setReserving(false)
    }
  }

  return (
    <div className="food-page">
      <div className="food-header">
        <div>
          <h1>Explore Surplus Food</h1>
          <p>Find affordable food before it goes to waste.</p>
        </div>
      </div>

      {loading ? (
        <p>Loading food...</p>
      ) : foodItems.length === 0 ? (
        <div className="food-card">
          <div className="food-content">
            <h2>No food listings available</h2>
            <p>New surplus food listings will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="food-grid">
          {foodItems.map((food) => (
            <div className="food-card" key={food.id}>
              <div className="food-image">
                FoodRescue
              </div>

              <div className="food-content">
                <h2>{food.foodName}</h2>

                <p>{food.description}</p>

                <p>
                  Restaurant: {food.restaurantName}
                </p>

                <p>
                  Quantity: {food.remainingQuantity}
                </p>

                <p>
                  Pickup before: {food.pickupDeadline}
                </p>

                <div className="price">
                  <span>₹{food.originalPrice}</span>
                  <strong>₹{food.rescuePrice}</strong>
                </div>

                <button
  className="reserve-btn"
  onClick={() => openReservation(food)}
  disabled={food.remainingQuantity === 0}
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

      {selectedFood && (
        <div className="reservation-overlay">
          <div className="reservation-modal">
            <div className="auth-header">
              <h1>Reserve Food</h1>
              <p>{selectedFood.foodName}</p>
            </div>

            <form
              className="auth-form"
              onSubmit={handleReservation}
            >
              <div className="input-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(event) =>
                    setCustomerEmail(event.target.value)
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={selectedFood.remainingQuantity}
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(event.target.value)
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-btn"
                disabled={reserving}
              >
                {reserving ? 'Reserving...' : 'Confirm Reservation'}
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
      {reservationSummary && (
  <div className="reservation-overlay">
    <div className="reservation-modal">
      <div className="auth-header">
        <h1>Reservation Successful</h1>
        <p>Your food has been reserved successfully.</p>
      </div>

      <div className="reservation-summary">
        <h2>{reservationSummary.foodName}</h2>

        <p>
          Restaurant: {reservationSummary.restaurantName}
        </p>

        <p>
          Quantity: {reservationSummary.quantity}
        </p>

        <p>
          Total Price: ₹{reservationSummary.totalPrice}
        </p>

        <p>
          Pickup Before: {reservationSummary.pickupDeadline}
        </p>
      </div>

      <button
        className="auth-btn"
        onClick={() => setReservationSummary(null)}
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