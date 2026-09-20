import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { apiFetch, logoutUser } from '../../../utils/api'
import '../../../styles/restaurant.css'

function RestaurantSidebar({ navigate, location, handleLogout }) {
  const isActive = (path) => location.pathname === path

  return (
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
          className={`rest-nav-item${isActive('/restaurant-dashboard') ? ' active' : ''}`}
          onClick={() => navigate('/restaurant-dashboard')}
        >
          <span className="rest-nav-icon">⌂</span>
          Dashboard
        </button>

        <button
          className={`rest-nav-item${isActive('/add-food') ? ' active' : ''}`}
          onClick={() => navigate('/add-food')}
        >
          <span className="rest-nav-icon">+</span>
          Add Food
        </button>

        <button
          className={`rest-nav-item${isActive('/my-food') ? ' active' : ''}`}
          onClick={() => navigate('/my-food')}
        >
          <span className="rest-nav-icon">▤</span>
          My Listings
        </button>

        <button
          className={`rest-nav-item${isActive('/restaurant-profile') ? ' active' : ''}`}
          onClick={() => navigate('/restaurant-profile')}
        >
          <span className="rest-nav-icon">☆</span>
          Profile
        </button>
      </nav>

      <div className="rest-sidebar-bottom">
        <div className="rest-profile">
          <div className="rest-avatar">R</div>
          <div>
            <strong>Restaurant</strong>
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
}

function EditFood() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    foodName: '',
    description: '',
    quantity: '',
    originalPrice: '',
    rescuePrice: '',
    allergens: '',
    pickupDeadline: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const loadFood = async () => {
      try {
        const response = await apiFetch(`/api/food/${id}`)

        if (!response.ok) {
          throw new Error('Food listing not found')
        }

        const food = await response.json()

        setFormData({
          foodName: food.foodName || '',
          description: food.description || '',
          quantity: food.quantity ?? '',
          originalPrice: food.originalPrice ?? '',
          rescuePrice: food.rescuePrice ?? '',
          allergens: food.allergens || '',
          pickupDeadline: food.pickupDeadline
            ? String(food.pickupDeadline).slice(0, 16)
            : ''
        })
      } catch (error) {
        setMessage(error.message || 'Unable to load food')
      } finally {
        setLoading(false)
      }
    }

    loadFood()
  }, [id])

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setIsSuccess(false)

    try {
      const response = await apiFetch(`/api/food/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          foodName: formData.foodName,
          description: formData.description,
          quantity: Number(formData.quantity),
          originalPrice: Number(formData.originalPrice),
          rescuePrice: Number(formData.rescuePrice),
          allergens: formData.allergens.trim() || 'None',
          pickupDeadline: formData.pickupDeadline
        })
      })

      const text = await response.text()

      if (!response.ok) {
        throw new Error(text || 'Failed to update food')
      }

      setIsSuccess(true)
      setMessage('Food listing updated successfully!')

      setTimeout(() => {
        navigate('/my-food')
      }, 1200)
    } catch (error) {
      setMessage(error.message || 'Unable to update food')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="rest-loading">
        <div className="rest-loading-inner">
          <div className="rest-spinner" />
          <span>Loading food details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rest-layout">
      <RestaurantSidebar
        navigate={navigate}
        location={location}
        handleLogout={handleLogout}
      />

      <main className="rest-main">
        <header className="rest-topbar">
          <div>
            <h1>Edit Listing</h1>
            <p>Update your food listing details</p>
          </div>
          <button
            className="rest-btn-secondary"
            onClick={() => navigate('/my-food')}
            disabled={saving}
          >
            ← My Listings
          </button>
        </header>

        <div className="rest-form-page">
          {message && (
            <div className={isSuccess ? 'rest-message' : 'rest-error'}>
              {message}
            </div>
          )}

          <div className="rest-form-panel">
            <div className="rest-form-header">
              <h2>Edit Food Listing</h2>
              <p>Update the details for this food item.</p>
            </div>

            <form className="rest-form" onSubmit={handleSubmit}>
              <div className="rest-field">
                <label>Food Name</label>
                <input
                  type="text"
                  name="foodName"
                  value={formData.foodName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="rest-field">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="rest-field-row">
                <div className="rest-field">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>

                <div className="rest-field">
                  <label>Pickup Deadline</label>
                  <input
                    type="datetime-local"
                    name="pickupDeadline"
                    value={formData.pickupDeadline}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="rest-field-row">
                <div className="rest-field">
                  <label>Original Price (₹)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="rest-field">
                  <label>Rescue Price (₹)</label>
                  <input
                    type="number"
                    name="rescuePrice"
                    value={formData.rescuePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="rest-field">
                <label>Allergens</label>
                <input
                  type="text"
                  name="allergens"
                  value={formData.allergens}
                  onChange={handleChange}
                  placeholder="Milk, Nuts, Gluten"
                />
                <small>
                  Enter allergens separated by commas. Leave blank if none.
                </small>
              </div>

              <div className="rest-form-actions">
                <button
                  type="submit"
                  className="rest-submit-btn"
                  disabled={saving}
                >
                  {saving ? 'Updating...' : 'Update Food Listing'}
                </button>

                <button
                  type="button"
                  className="rest-cancel-btn"
                  onClick={() => navigate('/my-food')}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default EditFood
