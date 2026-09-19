import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../../../utils/api'

function NGOProfile() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    ngoName: '',
    address: '',
    phone: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await apiFetch(
          '/api/ngos/my-profile'
        )

        if (response.status === 404) {
          setProfile(null)
          setEditing(true)
          return
        }

        if (!response.ok) {
          throw new Error(
            'Unable to load NGO profile'
          )
        }

        const data = await response.json()

        setProfile(data)

        setForm({
          ngoName: data.ngoName || '',
          address: data.address || '',
          phone: data.phone || ''
        })
      } catch (error) {
        setMessage(
          error.message ||
            'Unable to load NGO profile'
        )
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.ngoName.trim()) {
      setMessage('NGO name is required')
      return
    }

    if (!form.address.trim()) {
      setMessage('Address is required')
      return
    }

    if (!form.phone.trim()) {
      setMessage('Phone number is required')
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await apiFetch(
        profile
          ? '/api/ngos/profile'
          : '/api/ngos/profile',
        {
          method: profile ? 'PUT' : 'POST',
          body: JSON.stringify({
            ngoName: form.ngoName,
            address: form.address,
            phone: form.phone
          })
        }
      )

      const text = await response.text()

      let data

      try {
        data = JSON.parse(text)
      } catch {
        data = text
      }

      if (!response.ok) {
        throw new Error(
          typeof data === 'string'
            ? data
            : 'Unable to save NGO profile'
        )
      }

      setProfile(data)

      setForm({
        ngoName: data.ngoName || '',
        address: data.address || '',
        phone: data.phone || ''
      })

      setEditing(false)
      setMessage(
        profile
          ? 'NGO profile updated successfully'
          : 'NGO profile created successfully'
      )
    } catch (error) {
      setMessage(
        error.message ||
          'Unable to save NGO profile'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>NGO Profile</h1>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>NGO Profile</h1>

          <p>
            Manage your NGO information.
          </p>
        </div>
      </div>

      {message && (
        <div className="my-food-message">
          {message}
        </div>
      )}

      <div className="dashboard-card">
        {editing ? (
          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="input-group">
              <label>NGO Name</label>

              <input
                type="text"
                name="ngoName"
                value={form.ngoName}
                onChange={handleChange}
                placeholder="Enter NGO name"
                required
              />
            </div>

            <div className="input-group">
              <label>Address</label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter NGO address"
                rows="4"
                required
              />
            </div>

            <div className="input-group">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : profile
                  ? 'Update Profile'
                  : 'Create Profile'}
            </button>

            {profile && (
              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  setEditing(false)
                }
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </form>
        ) : (
          <div className="profile-details">
            <h2>{profile.ngoName}</h2>

            <div className="profile-info">
              <p>
                <strong>Address:</strong>{' '}
                {profile.address}
              </p>

              <p>
                <strong>Phone:</strong>{' '}
                {profile.phone}
              </p>

              <p>
                <strong>Verification:</strong>{' '}
                {profile.verificationStatus}
              </p>
            </div>

            <div className="dashboard-actions">
              <button
                className="add-food-btn"
                onClick={() =>
                  setEditing(true)
                }
              >
                Edit Profile
              </button>

              
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NGOProfile
