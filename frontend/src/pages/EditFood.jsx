import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../utils/api'

function EditFood() {
  const { id } = useParams()
  const navigate = useNavigate()

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

  useEffect(() => {
    const loadFood = async () => {
      try {
        const response = await apiFetch(
          `/api/food/${id}`
        )

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
        setMessage(
          error.message || 'Unable to load food'
        )
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

    try {
      const response = await apiFetch(
        `/api/food/${id}`,
        {
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
        }
      )

      const text = await response.text()

      if (!response.ok) {
        throw new Error(
          text || 'Failed to update food'
        )
      }

      setMessage(
        'Food listing updated successfully'
      )

      setTimeout(() => {
        navigate('/my-food')
      }, 1000)
    } catch (error) {
      setMessage(
        error.message || 'Unable to update food'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Edit Food</h1>
          <p>Loading food details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Edit Food Listing</h1>
          <p>
            Update your food listing details.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="input-group">
            <label>Food Name</label>
            <input
              type="text"
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
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
              min="0"
              step="0.01"
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
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="input-group">
            <label>Allergens</label>
            <input
              type="text"
              name="allergens"
              value={formData.allergens}
              onChange={handleChange}
              placeholder="Milk, Nuts, Gluten"
            />

            <small>
              Enter allergens separated by commas.
              Enter None if there are no known allergens.
            </small>
          </div>

          <div className="input-group">
            <label>Pickup Deadline</label>
            <input
              type="datetime-local"
              name="pickupDeadline"
              value={formData.pickupDeadline}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={saving}
          >
            {saving
              ? 'Updating...'
              : 'Update Food Listing'}
          </button>

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}
        </form>

        <button
          className="secondary-btn"
          onClick={() => navigate('/my-food')}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default EditFood