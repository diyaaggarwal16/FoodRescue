import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddFood() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const [formData, setFormData] = useState({
    foodName: '',
    description: '',
    quantity: '',
    originalPrice: '',
    rescuePrice: '',
    pickupDeadline: '',
    restaurantName: ''
  })

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:8080/api/food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          foodName: formData.foodName,
          description: formData.description,
          quantity: Number(formData.quantity),
          originalPrice: Number(formData.originalPrice),
          rescuePrice: Number(formData.rescuePrice),
          pickupDeadline: formData.pickupDeadline,
          restaurantName: user.fullName,
          restaurantId: user.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create listing')
      }

      setMessage('Food listing created successfully')

      setFormData({
        foodName: '',
        description: '',
        quantity: '',
        originalPrice: '',
        rescuePrice: '',
        pickupDeadline: '',
        restaurantName: ''
      })
    } catch (error) {
      setMessage('Unable to create food listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Add Food Listing</h1>
          <p>List your surplus food for rescue.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Food Name</label>
            <input
              type="text"
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              placeholder="Veg Sandwich"
              required
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Fresh vegetable sandwich"
              required
            />
          </div>

          <div className="input-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="30"
              min="1"
              required
            />
          </div>

          <div className="input-group">
            <label>Original Price</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              placeholder="200"
              min="0"
              required
            />
          </div>

          <div className="input-group">
            <label>Rescue Price</label>
            <input
              type="number"
              name="rescuePrice"
              value={formData.rescuePrice}
              onChange={handleChange}
              placeholder="80"
              min="0"
              required
            />
          </div>

          <div className="input-group">
            <label>Pickup Deadline</label>
            <input
              type="time"
              name="pickupDeadline"
              value={formData.pickupDeadline}
              onChange={handleChange}
              required
            />
          </div>

          

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Food Listing'}
          </button>

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}
        </form>

        <button
          className="secondary-btn"
          onClick={() => navigate('/food')}
        >
          View Food Listings
        </button>
      </div>
    </div>
  )
}

export default AddFood