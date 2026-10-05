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

  const [images, setImages] = useState([
    { slot: 1, url: '', file: null, preview: '' },
    { slot: 2, url: '', file: null, preview: '' },
    { slot: 3, url: '', file: null, preview: '' }
  ])

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

        const imageUrls = [
          food.image1Url || '',
          food.image2Url || '',
          food.image3Url || ''
        ]

        setImages(
          imageUrls.map((url, index) => ({
            slot: index + 1,
            url,
            file: null,
            preview: url
              ? `http://localhost:8080${url.startsWith('/') ? '' : '/'}${url}`
              : ''
          }))
        )
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

  const validateImage = (file) => {
    if (!file.type.startsWith('image/')) {
      setMessage('Only image files are allowed.')
      setIsSuccess(false)
      return false
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Each image must be 5MB or smaller.')
      setIsSuccess(false)
      return false
    }

    return true
  }

  const handleImageSelect = (slot, event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!validateImage(file)) {
      event.target.value = ''
      return
    }

    const preview = URL.createObjectURL(file)

    setImages((currentImages) =>
      currentImages.map((image) =>
        image.slot === slot
          ? {
              ...image,
              file,
              preview,
              url: image.url
            }
          : image
      )
    )

    setMessage('')
    setIsSuccess(false)
  }

  const handleRemoveImage = async (slot) => {
    const image = images.find((item) => item.slot === slot)

    if (!image) {
      return
    }

    setSaving(true)
    setMessage('')
    setIsSuccess(false)

    try {
      if (image.url) {
        const response = await apiFetch(
          `/api/food/${id}/images/${slot}`,
          {
            method: 'DELETE'
          }
        )

        const text = await response.text()

        if (!response.ok) {
          throw new Error(text || 'Failed to remove image')
        }
      }

      if (image.preview && image.file) {
        URL.revokeObjectURL(image.preview)
      }

      setImages((currentImages) =>
        currentImages.map((item) =>
          item.slot === slot
            ? {
                ...item,
                url: '',
                file: null,
                preview: ''
              }
            : item
        )
      )

      setMessage('Image removed successfully.')
      setIsSuccess(true)
    } catch (error) {
      setMessage(error.message || 'Unable to remove image')
      setIsSuccess(false)
    } finally {
      setSaving(false)
    }
  }

  const uploadImage = async (slot, file) => {
    const formDataToUpload = new FormData()

    formDataToUpload.append(`image${slot}`, file)

    const response = await apiFetch(
      `/api/food/${id}/images`,
      {
        method: 'POST',
        body: formDataToUpload
      }
    )

    const text = await response.text()

    if (!response.ok) {
      throw new Error(text || `Failed to upload image ${slot}`)
    }
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

      for (const image of images) {
        if (image.file) {
          await uploadImage(image.slot, image.file)
        }
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
              <p>Update the details and images for this food item.</p>
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

              <div className="rest-field">
                <label>Food Images</label>
                <small>
                  Add up to 3 images. Each image must be 5MB or smaller.
                </small>

                <div className="rest-image-manager">
                  {images.map((image) => (
                    <div
                      className="rest-image-slot"
                      key={image.slot}
                    >
                      <div className="rest-image-preview">
                        {image.preview ? (
                          <img
                            src={image.preview}
                            alt={`Food ${image.slot}`}
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </div>

                      <div className="rest-image-slot-title">
                        Image {image.slot}
                      </div>

                      <label className="rest-image-select">
                        {image.preview
                          ? 'Replace Image'
                          : 'Select Image'}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleImageSelect(
                              image.slot,
                              event
                            )
                          }
                          disabled={saving}
                        />
                      </label>

                      {image.preview && (
                        <button
                          type="button"
                          className="rest-image-remove"
                          onClick={() =>
                            handleRemoveImage(image.slot)
                          }
                          disabled={saving}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rest-form-actions">
                <button
                  type="submit"
                  className="rest-submit-btn"
                  disabled={saving}
                >
                  {saving
                    ? 'Updating...'
                    : 'Update Food Listing'}
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