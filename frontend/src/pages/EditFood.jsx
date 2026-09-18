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
    pickupDeadline: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadFood = async () => {
      try {
        const response = await apiFetch('/api/food')

        if (!response.ok) {
          throw new Error('Failed to load food')
        }

        const foods = await response.json()
        const food = foods.find(
          (item) => item.id === Number(id)
        )

        if (!food) {
          throw new Error('Food listing not found')
        }

        setFormData({
          foodName: food.foodName || '',
          description: food.description || '',
          quantity: food.quantity || '',
          originalPrice: food.originalPrice || '',
          rescuePrice: food.rescuePrice || '',
          pickupDeadline: food.pickupDeadline || ''
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

    try {
      const response = await apiFetch(`/api/food/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          foodName: formData.foodName,
          description: formData.description,
          quantity: Number(formData.quantity),
          originalPrice: Number(formData.originalPrice),
          rescuePrice: Number(formData.rescuePrice),
          pickupDeadline: formData.pickupDeadline
        })
      })

      const text = await response.text()

      if (!response.ok) {
        throw new Error(text || 'Failed to update food')
      }

      setMessage('Food listing updated successfully')

      setTimeout(() => {
        navigate('/my-food')
      }, 1000)
    } catch (error) {
      setMessage(error.message || 'Unable to update food')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Edit Food</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Edit Food Listing</h1>
          <p>Update your food listing details.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            <input
              type="text"
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
            disabled={saving}
          >
            {saving ? 'Updating...' : 'Update Food Listing'}
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
        >
          Back to My Food
        </button>
      </div>
    </div>
  )
}

export default EditFood