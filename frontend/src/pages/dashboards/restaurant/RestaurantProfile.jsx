import { useEffect, useState } from 'react'
import { apiFetch } from '../../../utils/api'

function RestaurantProfile() {
  const [formData, setFormData] = useState({
    restaurantName: '',
    address: '',
    phone: ''
  })

  const [verificationStatus, setVerificationStatus] =
    useState('PENDING')

  const [profileExists, setProfileExists] = useState(false)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await apiFetch(
        '/api/restaurants/my-profile'
      )

      if (response.status === 404) {
        setProfileExists(false)
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          'Failed to load restaurant profile'
        )
      }

      setFormData({
        restaurantName: data.restaurantName || '',
        address: data.address || '',
        phone: data.phone || ''
      })

      setVerificationStatus(
        data.verificationStatus || 'PENDING'
      )

      setProfileExists(true)
    } catch (error) {
      setMessage(
        error.message || 'Unable to load profile'
      )
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

    try {
      const response = await apiFetch(
        '/api/restaurants/profile',
        {
          method: 'PUT',
          body: JSON.stringify(formData)
        }
      )

      const text = await response.text()

      if (!response.ok) {
        throw new Error(
          text || 'Failed to update restaurant profile'
        )
      }

      const data = JSON.parse(text)

      setFormData({
        restaurantName: data.restaurantName || '',
        address: data.address || '',
        phone: data.phone || ''
      })

      setVerificationStatus(
        data.verificationStatus || verificationStatus
      )

      setEditing(false)

      setMessage(
        'Restaurant profile updated successfully'
      )
    } catch (error) {
      setMessage(
        error.message || 'Unable to update restaurant profile'
      )
    } finally {
      setSaving(false)
    }
  }

  const getVerificationClass = () => {
    const status =
      verificationStatus.toUpperCase()

    if (status === 'VERIFIED') {
      return 'verification-status verified'
    }

    if (status === 'REJECTED') {
      return 'verification-status rejected'
    }

    return 'verification-status pending'
  }

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p>Loading restaurant profile...</p>
        </div>
      </div>
    )
  }

  if (profileExists && !editing) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Restaurant Profile</h1>
            <p>Your restaurant details</p>
          </div>

          <div className="profile-details">
            <div className="input-group">
              <label>Restaurant Name</label>
              <p>{formData.restaurantName}</p>
            </div>

            <div className="input-group">
              <label>Address</label>
              <p>{formData.address}</p>
            </div>

            <div className="input-group">
              <label>Phone</label>
              <p>{formData.phone}</p>
            </div>

            <div className="input-group">
              <label>Verification Status</label>

              <span className={getVerificationClass()}>
                {verificationStatus}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="auth-btn"
            onClick={() => {
              setMessage('')
              setEditing(true)
            }}
          >
            Edit Profile
          </button>

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Edit Restaurant Profile</h1>

          <p>
            Update your restaurant details.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleUpdate}
        >
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

          <div className="input-group">
            <label>Verification Status</label>

            <span className={getVerificationClass()}>
              {verificationStatus}
            </span>
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : 'Save Changes'}
          </button>

          <button
            type="button"
            className="secondary-btn"
            onClick={() => {
              setMessage('')
              setEditing(false)
            }}
            disabled={saving}
          >
            Cancel
          </button>

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default RestaurantProfile