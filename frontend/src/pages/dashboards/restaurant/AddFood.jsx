import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiFetch, logoutUser } from '../../../utils/api'
import '../../../styles/restaurant.css'

function RestaurantSidebar({ navigate, location, handleLogout }) {
  const isActive = (path) => location.pathname === path
  const [restaurant, setRestaurant] = useState(null)
  useEffect(() => {
  const loadRestaurant = async () => {
    try {
      const response = await apiFetch('/api/restaurants/my-profile')

      if (response.ok) {
        const data = await response.json()
        setRestaurant(data)
      }
    } catch (error) {
      console.error('Unable to load restaurant profile:', error)
    }
  }

  loadRestaurant()
}, [])
const restaurantName = restaurant?.restaurantName || 'Restaurant'

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
          className={`rest-nav-item${isActive('/food-needs') ? ' active' : ''}`}
          onClick={() => navigate('/restaurant/food-needs')}
        >
          <span className="rest-nav-icon">♡</span>
          NGO Food Needs
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
          <div className="rest-avatar">
            {restaurantName.charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>{restaurantName}</strong>
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

function AddFood() {
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
    { file: null, preview: '' },
    { file: null, preview: '' },
    { file: null, preview: '' }
  ])

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview)
        }
      })
    }
  }, [])

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleImageChange = (event, index) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setMessage('Please select a valid image file.')
      setIsSuccess(false)
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Each image must be smaller than 5MB.')
      setIsSuccess(false)
      event.target.value = ''
      return
    }

    setMessage('')
    setIsSuccess(false)

    setImages((currentImages) => {
      const updatedImages = [...currentImages]

      if (updatedImages[index].preview) {
        URL.revokeObjectURL(updatedImages[index].preview)
      }

      updatedImages[index] = {
        file,
        preview: URL.createObjectURL(file)
      }

      return updatedImages
    })

    event.target.value = ''
  }

  const removeImage = (index) => {
    setImages((currentImages) => {
      const updatedImages = [...currentImages]

      if (updatedImages[index].preview) {
        URL.revokeObjectURL(updatedImages[index].preview)
      }

      updatedImages[index] = {
        file: null,
        preview: ''
      }

      return updatedImages
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    setMessage('')
    setIsSuccess(false)

    try {
      const profileResponse = await apiFetch(
        '/api/restaurants/my-profile'
      )

      if (profileResponse.status === 404) {
        setMessage(
          'Please create your restaurant profile first.'
        )
        setLoading(false)
        return
      }

      if (!profileResponse.ok) {
        throw new Error(
          'Failed to load restaurant profile'
        )
      }

      const response = await apiFetch('/api/food', {
        method: 'POST',
        body: JSON.stringify({
          foodName: formData.foodName,
          description: formData.description,
          quantity: Number(formData.quantity),
          originalPrice: Number(formData.originalPrice),
          rescuePrice: Number(formData.rescuePrice),
          allergens:
            formData.allergens.trim() || 'None',
          pickupDeadline: formData.pickupDeadline
        })
      })

      const text = await response.text()

      if (!response.ok) {
        throw new Error(
          text || 'Failed to create listing'
        )
      }

      const createdListing = JSON.parse(text)

      const selectedImages = images.filter(
        (image) => image.file
      )

      if (selectedImages.length > 0) {
        const formDataImages = new FormData()

        selectedImages.forEach((image, index) => {
          formDataImages.append(
            `image${index + 1}`,
            image.file
          )
        })

        const imageResponse = await apiFetch(
          `/api/food/${createdListing.id}/images`,
          {
            method: 'POST',
            body: formDataImages
          }
        )

        if (!imageResponse.ok) {
          const imageError =
            await imageResponse.text()

          throw new Error(
            imageError ||
              'Food listing created, but image upload failed.'
          )
        }
      }

      setIsSuccess(true)
      setMessage(
        'Food listing created successfully!'
      )

      setFormData({
        foodName: '',
        description: '',
        quantity: '',
        originalPrice: '',
        rescuePrice: '',
        allergens: '',
        pickupDeadline: ''
      })

      setImages([
        { file: null, preview: '' },
        { file: null, preview: '' },
        { file: null, preview: '' }
      ])
    } catch (error) {
      setMessage(
        error.message ||
          'Unable to create food listing'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/')
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
            <h1>Add Food</h1>
            <p>List your surplus food for rescue</p>
          </div>

          <button
            className="rest-btn-secondary"
            onClick={() => navigate('/my-food')}
          >
            ← My Listings
          </button>
        </header>

        <div className="rest-form-page">
          {message && (
            <div
              className={
                isSuccess
                  ? 'rest-message'
                  : 'rest-error'
              }
            >
              {message}
            </div>
          )}

          <div className="rest-form-panel">
            <div className="rest-form-header">
              <h2>New Food Listing</h2>
              <p>
                Fill in the details to list surplus food
                for rescue.
              </p>
            </div>

            <form
              className="rest-form"
              onSubmit={handleSubmit}
            >
              <div className="rest-field">
                <label>Food Name</label>

                <input
                  type="text"
                  name="foodName"
                  value={formData.foodName}
                  onChange={handleChange}
                  placeholder="e.g. Veg Sandwich"
                  required
                />
              </div>

              <div className="rest-field">
                <label>Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the food item"
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
                    placeholder="30"
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
                    placeholder="200"
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
                    placeholder="80"
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
                  Enter allergens separated by commas.
                  Leave blank if none.
                </small>
              </div>

              <div className="rest-field">
                <label>
                  Food Images
                  <span
                    style={{
                      marginLeft: '8px',
                      opacity: 0.6,
                      fontWeight: 400
                    }}
                  >
                    (Maximum 3)
                  </span>
                </label>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(3, 1fr)',
                    gap: '14px',
                    marginTop: '10px'
                  }}
                >
                  {images.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        minHeight: '150px',
                        border:
                          '1px dashed rgba(192, 132, 252, 0.35)',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        background: '#120d1c'
                      }}
                    >
                      {image.preview ? (
                        <>
                          <img
                            src={image.preview}
                            alt={`Food preview ${
                              index + 1
                            }`}
                            style={{
                              width: '100%',
                              height: '150px',
                              display: 'block',
                              objectFit: 'cover'
                            }}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(index)
                            }
                            disabled={loading}
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              width: '30px',
                              height: '30px',
                              border: 'none',
                              borderRadius: '50%',
                              background:
                                'rgba(10, 5, 18, 0.82)',
                              color: '#ffffff',
                              cursor: 'pointer',
                              fontSize: '18px',
                              lineHeight: '1'
                            }}
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <label
                          style={{
                            width: '100%',
                            height: '150px',
                            display: 'flex',
                            flexDirection:
                              'column',
                            alignItems: 'center',
                            justifyContent:
                              'center',
                            cursor: 'pointer',
                            color: '#c084fc',
                            gap: '8px'
                          }}
                        >
                          <span
                            style={{
                              fontSize: '28px'
                            }}
                          >
                            +
                          </span>

                          <span>
                            Image {index + 1}
                          </span>

                          <small
                            style={{
                              opacity: 0.55
                            }}
                          >
                            Click to select
                          </small>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              handleImageChange(
                                event,
                                index
                              )
                            }
                            disabled={loading}
                            style={{
                              display: 'none'
                            }}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>

                <small>
                  JPG, PNG, WEBP • Maximum 5MB per image
                </small>
              </div>

              <div className="rest-form-actions">
                <button
                  type="submit"
                  className="rest-submit-btn"
                  disabled={loading}
                >
                  {loading
                    ? 'Creating...'
                    : 'Create Food Listing'}
                </button>

                <button
                  type="button"
                  className="rest-cancel-btn"
                  onClick={() =>
                    navigate('/my-food')
                  }
                  disabled={loading}
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

export default AddFood