import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../utils/api'

function RestaurantProfile() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    restaurantName: '',
    address: '',
    phone: ''
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
      const response = await apiFetch('/api/restaurants/profile', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      const text = await response.text()

      if (!response.ok) {
        throw new Error(text || 'Failed to create restaurant profile')
      }

      setMessage('Restaurant profile created successfully')

      setTimeout(() => {
        navigate('/add-food')
      }, 1000)
    } catch (error) {
      setMessage(error.message || 'Unable to create restaurant profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Restaurant Profile</h1>
          <p>Set up your restaurant details.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              placeholder="Green Leaf Restaurant"
              required
            />
          </div>

          <div className="input-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Restaurant address"
              required
            />
          </div>

          <div className="input-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Restaurant Profile'}
          </button>

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}
        </form>

        <button
          className="secondary-btn"
          onClick={() => navigate('/add-food')}
        >
          Go to Add Food
        </button>
      </div>
    </div>
  )
}

export default RestaurantProfile