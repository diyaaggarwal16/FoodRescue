import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../utils/api'

function MyFood() {
  const navigate = useNavigate()

  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadFoods = async () => {
    try {
      const profileResponse = await apiFetch(
        '/api/restaurants/my-profile'
      )

      if (!profileResponse.ok) {
        throw new Error('Restaurant profile not found')
      }

      const profile = await profileResponse.json()

      const response = await apiFetch(
        `/api/food/restaurant/${profile.id}`
      )

      if (!response.ok) {
        throw new Error('Failed to load food listings')
      }

      const data = await response.json()
      setFoods(data)
    } catch (error) {
      setMessage(error.message || 'Unable to load food listings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFoods()
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this food listing?'
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await apiFetch(`/api/food/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Failed to delete listing')
      }

      setFoods(
        foods.filter((food) => food.id !== id)
      )

      setMessage('Food listing deleted successfully')
    } catch (error) {
      setMessage(error.message || 'Unable to delete listing')
    }
  }

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>My Food Listings</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>My Food Listings</h1>
          <p>Manage your restaurant food listings.</p>
        </div>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        {foods.length === 0 ? (
          <p>No food listings found.</p>
        ) : (
          <div>
            {foods.map((food) => (
              <div
                key={food.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  marginBottom: '15px',
                  borderRadius: '10px'
                }}
              >
                <h3>{food.foodName}</h3>

                <p>{food.description}</p>

                <p>
                  Quantity: {food.quantity}
                </p>

                <p>
                  Rescue Price: ₹{food.rescuePrice}
                </p>

                <p>
                  Pickup: {food.pickupDeadline}
                </p>

                <p>
                  Status: {food.status}
                </p>

                <button
                  className="secondary-btn"
                  onClick={() =>
                    navigate(`/edit-food/${food.id}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="secondary-btn"
                  onClick={() =>
                    handleDelete(food.id)
                  }
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          className="auth-btn"
          onClick={() => navigate('/add-food')}
        >
          Add New Food
        </button>
      </div>
    </div>
  )
}

export default MyFood