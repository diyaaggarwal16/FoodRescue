import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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

function FoodImageCarousel({ food }) {
  const images = [
    food.image1Url,
    food.image2Url,
    food.image3Url
  ].filter(Boolean)

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setCurrentIndex(0)
  }, [food.id])

  useEffect(() => {
    if (images.length <= 1) {
      return
    }

    const timer = setInterval(() => {
      setCurrentIndex((current) =>
        (current + 1) % images.length
      )
    }, 4000)

    return () => clearInterval(timer)
  }, [images.length])

  const getImageUrl = (url) => {
    if (!url) {
      return ''
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    return `http://localhost:8080${url}`
  }

  if (images.length === 0) {
    return (
      <div className="rest-food-image-carousel">
        <div className="rest-food-image-placeholder">
          FoodRescue
        </div>
      </div>
    )
  }

  const previousImage = () => {
    setCurrentIndex((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    )
  }

  const nextImage = () => {
    setCurrentIndex((current) =>
      (current + 1) % images.length
    )
  }

  return (
    <div className="rest-food-image-carousel">
      <img
        className="rest-food-card-image"
        src={getImageUrl(images[currentIndex])}
        alt={food.foodName}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="rest-carousel-arrow rest-carousel-prev"
            onClick={previousImage}
          >
            ‹
          </button>

          <button
            type="button"
            className="rest-carousel-arrow rest-carousel-next"
            onClick={nextImage}
          >
            ›
          </button>

          <div className="rest-carousel-dots">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`rest-carousel-dot${
                  index === currentIndex
                    ? ' active'
                    : ''
                }`}
                onClick={() =>
                  setCurrentIndex(index)
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function MyFood() {
  const navigate = useNavigate()
  const location = useLocation()

  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadFood = async () => {
    try {
      setLoading(true)
      setMessage('')

      const profileResponse = await apiFetch(
        '/api/restaurants/my-profile'
      )

      if (!profileResponse.ok) {
        throw new Error(
          'Unable to load restaurant profile'
        )
      }

      const profile = await profileResponse.json()

      const foodResponse = await apiFetch(
        `/api/food/restaurant/${profile.id}`
      )

      if (!foodResponse.ok) {
        throw new Error(
          'Unable to load food listings'
        )
      }

      const data = await foodResponse.json()

      setFoods(data)
    } catch (error) {
      setMessage(
        error.message ||
          'Unable to load food listings'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFood()
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this food listing?'
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await apiFetch(
        `/api/food/${id}`,
        {
          method: 'DELETE'
        }
      )

      const text = await response.text()

      if (!response.ok) {
        throw new Error(
          text || 'Failed to delete listing'
        )
      }

      setFoods((current) =>
        current.filter((food) => food.id !== id)
      )
    } catch (error) {
      setMessage(
        error.message ||
          'Unable to delete food listing'
      )
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
            <h1>My Listings</h1>
            <p>
              Manage your surplus food listings
            </p>
          </div>

          <button
            className="rest-submit-btn"
            onClick={() => navigate('/add-food')}
          >
            + Add Food
          </button>
        </header>

        {message && (
          <div className="rest-error">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rest-empty-state">
            Loading your listings...
          </div>
        ) : foods.length === 0 ? (
          <div className="rest-empty-state">
            <h2>No food listings yet</h2>
            <p>
              Add your first surplus food listing
              to get started.
            </p>

            <button
              className="rest-submit-btn"
              onClick={() => navigate('/add-food')}
            >
              Add Food
            </button>
          </div>
        ) : (
          <div className="rest-food-grid">
            {foods.map((food) => {
              const soldOut =
                food.remainingQuantity <= 0 ||
                food.status === 'SOLD_OUT'

              return (
                <div
                  className="rest-food-card"
                  key={food.id}
                >
                  <FoodImageCarousel food={food} />

                  <div className="rest-food-card-body">
                    <div className="rest-food-card-top">
                      <div>
                        <h3>
                          {food.foodName}
                        </h3>

                        <p>
                          {food.description}
                        </p>
                      </div>

                      <span
                        className={
                          soldOut
                            ? 'rest-status sold-out'
                            : 'rest-status available'
                        }
                      >
                        {soldOut
                          ? 'SOLD OUT'
                          : 'AVAILABLE'}
                      </span>
                    </div>

                    <div className="rest-food-meta">
                      <div>
                        <span>Quantity</span>
                        <strong>
                          {food.remainingQuantity}/
                          {food.quantity}
                        </strong>
                      </div>

                      <div>
                        <span>Rescue Price</span>
                        <strong>
                          ₹{food.rescuePrice}
                        </strong>
                      </div>

                      <div>
                        <span>Original Price</span>
                        <strong>
                          ₹{food.originalPrice}
                        </strong>
                      </div>
                    </div>

                    <div className="rest-food-deadline">
                      <span>Pickup Deadline</span>
                      <strong>
                        {food.pickupDeadline
                          ? new Date(
                              food.pickupDeadline
                            ).toLocaleString()
                          : 'Not specified'}
                      </strong>
                    </div>

                    <div className="rest-food-actions">
                      <button
                        className="rest-btn-secondary"
                        onClick={() =>
                          navigate(
                            `/edit-food/${food.id}`
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="rest-delete-btn"
                        onClick={() =>
                          handleDelete(food.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default MyFood