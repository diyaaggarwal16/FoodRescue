import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiFetch, logoutUser } from '../../../utils/api'
import '../../../styles/restaurant.css'

function RestaurantSidebar({ restaurantName, navigate, location, handleLogout }) {
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
          <div className="rest-avatar">
            {(restaurantName || 'R').charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>{restaurantName || 'Restaurant'}</strong>
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

function RestaurantProfile() {
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    restaurantName: '',
    address: '',
    phone: ''
  })

  const [verificationStatus, setVerificationStatus] = useState('PENDING')
  const [profileExists, setProfileExists] = useState(false)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await apiFetch('/api/restaurants/my-profile')

      if (response.status === 404) {
        setProfileExists(false)
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error('Failed to load restaurant profile')
      }

      setFormData({
        restaurantName: data.restaurantName || '',
        address: data.address || '',
        phone: data.phone || ''
      })

      setVerificationStatus(data.verificationStatus || 'PENDING')
      setProfileExists(true)
    } catch (error) {
      setMessage(error.message || 'Unable to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setIsSuccess(false)

    try {
      const response = await apiFetch('/api/restaurants/profile', {
        method: 'PUT',
        body: JSON.stringify(formData)
      })

      const text = await response.text()

      if (!response.ok) {
        throw new Error(text || 'Failed to update restaurant profile')
      }

      const data = JSON.parse(text)

      setFormData({
        restaurantName: data.restaurantName || '',
        address: data.address || '',
        phone: data.phone || ''
      })

      setVerificationStatus(data.verificationStatus || verificationStatus)
      setEditing(false)
      setIsSuccess(true)
      setMessage('Restaurant profile updated successfully!')
    } catch (error) {
      setMessage(error.message || 'Unable to update restaurant profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setIsSuccess(false)

    try {
      const response = await apiFetch('/api/restaurants/profile', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      const text = await response.text()

      if (!response.ok) {
        throw new Error(text || 'Failed to create restaurant profile')
      }

      const data = JSON.parse(text)

      setFormData({
        restaurantName: data.restaurantName || '',
        address: data.address || '',
        phone: data.phone || ''
      })

      setVerificationStatus(data.verificationStatus || 'PENDING')
      setProfileExists(true)
      setEditing(false)
      setIsSuccess(true)
      setMessage('Restaurant profile created! Awaiting verification.')
    } catch (error) {
      setMessage(error.message || 'Unable to create restaurant profile')
    } finally {
      setSaving(false)
    }
  }

  const getVerificationClass = () => {
    const status = verificationStatus.toUpperCase()
    if (status === 'VERIFIED') return 'verified'
    if (status === 'REJECTED') return 'rejected'
    return 'pending'
  }

  const getVerificationMessage = () => {
    const status = verificationStatus.toUpperCase()
    if (status === 'VERIFIED') return 'Your restaurant profile has been verified.'
    if (status === 'REJECTED') return 'Your profile was rejected. Please review your details.'
    return 'Your profile is under review. You will be notified once it is verified.'
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
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rest-layout">
      <RestaurantSidebar
        restaurantName={formData.restaurantName}
        navigate={navigate}
        location={location}
        handleLogout={handleLogout}
      />

      <main className="rest-main">
        <header className="rest-topbar">
          <div>
            <h1>Profile</h1>
            <p>Your restaurant details and verification status</p>
          </div>
        </header>

        <div className="rest-profile-page">
          {message && (
            <div className={isSuccess ? 'rest-message' : 'rest-error'}>
              {message}
            </div>
          )}

          {/* View Mode */}
          {profileExists && !editing && (
            <div className="rest-profile-panel">
              <div className="rest-profile-hero">
                <div className="rest-profile-avatar">
                  {formData.restaurantName.charAt(0).toUpperCase() || 'R'}
                </div>
                <div>
                  <h2>{formData.restaurantName}</h2>
                  <p>Restaurant Profile</p>
                </div>
              </div>

              <div className="rest-info-grid">
                <div className="rest-info-item">
                  <label>Restaurant Name</label>
                  <p>{formData.restaurantName}</p>
                </div>

                <div className="rest-info-item">
                  <label>Address</label>
                  <p>{formData.address}</p>
                </div>

                <div className="rest-info-item">
                  <label>Phone</label>
                  <p>{formData.phone}</p>
                </div>

                <div className="rest-info-item">
                  <label>Verification Status</label>
                  <span className={`rest-verification ${getVerificationClass()}`}>
                    {verificationStatus}
                  </span>
                  <p className="rest-verification-msg">{getVerificationMessage()}</p>
                </div>
              </div>

              <button
                className="rest-btn-primary"
                style={{ width: '100%', minHeight: 46, fontSize: 14, justifyContent: 'center' }}
                onClick={() => {
                  setMessage('')
                  setIsSuccess(false)
                  setEditing(true)
                }}
              >
                ✏ Edit Profile
              </button>
            </div>
          )}

          {/* Create / Edit Form */}
          {(!profileExists || editing) && (
            <div className="rest-form-panel">
              <div className="rest-form-header">
                <h2>{profileExists ? 'Edit Restaurant Profile' : 'Create Restaurant Profile'}</h2>
                <p>
                  {profileExists
                    ? 'Update your restaurant details.'
                    : 'Set up your restaurant profile to start listing food.'}
                </p>
              </div>

              <form
                className="rest-form"
                onSubmit={profileExists ? handleUpdate : handleCreate}
              >
                <div className="rest-field">
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

                <div className="rest-field">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full restaurant address"
                    required
                  />
                </div>

                <div className="rest-field">
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

                {profileExists && (
                  <div className="rest-field">
                    <label>Verification Status</label>
                    <div style={{ marginTop: 4 }}>
                      <span className={`rest-verification ${getVerificationClass()}`}>
                        {verificationStatus}
                      </span>
                      <p className="rest-verification-msg">{getVerificationMessage()}</p>
                    </div>
                  </div>
                )}

                <div className="rest-form-actions">
                  <button
                    type="submit"
                    className="rest-submit-btn"
                    disabled={saving}
                  >
                    {saving
                      ? 'Saving...'
                      : profileExists
                      ? 'Save Changes'
                      : 'Create Profile'}
                  </button>

                  {profileExists && (
                    <button
                      type="button"
                      className="rest-cancel-btn"
                      disabled={saving}
                      onClick={() => {
                        setMessage('')
                        setIsSuccess(false)
                        setEditing(false)
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default RestaurantProfile