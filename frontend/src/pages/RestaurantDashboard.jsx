import { useEffect, useState } from 'react'

function RestaurantDashboard() {
  const [foodName, setFoodName] = useState('')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [rescuePrice, setRescuePrice] = useState('')
  const [pickupDeadline, setPickupDeadline] = useState('')

  const [foodItems, setFoodItems] = useState([])
  const [loadingFood, setLoadingFood] = useState(true)

  const loadRestaurantFood = async () => {
    const restaurantId = localStorage.getItem('userId')

    if (!restaurantId) {
      setLoadingFood(false)
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/food/restaurant/${restaurantId}`
      )

      const data = await response.json()

      if (response.ok) {
        setFoodItems(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingFood(false)
    }
  }

  useEffect(() => {
    loadRestaurantFood()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const restaurantId = localStorage.getItem('userId')
    const restaurantName = localStorage.getItem('fullName')

    try {
      const response = await fetch(
        'http://localhost:8080/api/food',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            foodName,
            description,
            quantity: Number(quantity),
            originalPrice: Number(originalPrice),
            rescuePrice: Number(rescuePrice),
            pickupDeadline,
            restaurantId: restaurantId
              ? Number(restaurantId)
              : null,
            restaurantName: restaurantName || ''
          })
        }
      )

      if (response.ok) {
        alert('Food listing added successfully!')

        setFoodName('')
        setDescription('')
        setQuantity('')
        setOriginalPrice('')
        setRescuePrice('')
        setPickupDeadline('')

        loadRestaurantFood()
      } else {
        const errorData = await response.text()
        alert(errorData || 'Failed to add food listing')
      }
    } catch (error) {
      console.error(error)
      alert('Unable to connect to the server')
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Restaurant Dashboard</h1>
        <p>
          Manage your food listings and help reduce food waste.
        </p>
      </div>

      <div className="dashboard-card">
        <h2>Add Food Listing</h2>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="input-group">
            <label>Food Name</label>
            <input
              type="text"
              value={foodName}
              onChange={(event) =>
                setFoodName(event.target.value)
              }
              placeholder="Enter food name"
              required
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Enter food description"
              required
            />
          </div>

          <div className="input-group">
            <label>Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) =>
                setQuantity(event.target.value)
              }
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="input-group">
            <label>Original Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={originalPrice}
              onChange={(event) =>
                setOriginalPrice(event.target.value)
              }
              placeholder="Enter original price"
              required
            />
          </div>

          <div className="input-group">
            <label>Rescue Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={rescuePrice}
              onChange={(event) =>
                setRescuePrice(event.target.value)
              }
              placeholder="Enter rescue price"
              required
            />
          </div>

          <div className="input-group">
            <label>Pickup Deadline</label>
            <input
              type="datetime-local"
              value={pickupDeadline}
              onChange={(event) =>
                setPickupDeadline(event.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
          >
            Add Food Listing
          </button>
        </form>
      </div>

      <div className="dashboard-card">
        <h2>My Food Listings</h2>

        {loadingFood ? (
          <p>Loading food listings...</p>
        ) : foodItems.length === 0 ? (
          <p>No food listings added yet.</p>
        ) : (
          <div className="food-listings">
            {foodItems.map((food) => (
              <div
                className="food-listing-item"
                key={food.id}
              >
                <h3>{food.foodName}</h3>

                <p>{food.description}</p>

                <p>
                  <strong>Total Quantity:</strong>{' '}
                  {food.quantity}
                </p>

                <p>
                  <strong>Remaining:</strong>{' '}
                  {food.remainingQuantity}
                </p>

                <p>
                  <strong>Original Price:</strong>{' '}
                  ₹{food.originalPrice}
                </p>

                <p>
                  <strong>Rescue Price:</strong>{' '}
                  ₹{food.rescuePrice}
                </p>

                <p>
                  <strong>Pickup Deadline:</strong>{' '}
                  {food.pickupDeadline}
                </p>

                <p>
                  <strong>Status:</strong>{' '}
                  {food.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantDashboard