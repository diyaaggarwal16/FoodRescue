import { useEffect, useState } from 'react'
import { apiFetch } from '../../../utils/api'
import '../../../styles/ngo.css'

function NGOProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [ngoName, setNgoName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await apiFetch(
        '/api/ngos/my-profile'
      )

      if (!response.ok) {
        const text = await response.text()
        throw new Error(
          text || 'Unable to load NGO profile'
        )
      }

      const data = await response.json()

      setProfile(data)
      setNgoName(data.ngoName || '')
      setAddress(data.address || '')
      setPhone(data.phone || '')
    } catch (err) {
      console.error(err)
      setError(
        err.message || 'Unable to load NGO profile'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleSave = async event => {
    event.preventDefault()

    try {
      setSaving(true)
      setMessage('')
      setError('')

      const response = await apiFetch(
        '/api/ngos/profile',
        {
          method: 'PUT',
          body: JSON.stringify({
            ngoName,
            address,
            phone
          })
        }
      )

      const text = await response.text()

      if (!response.ok) {
        throw new Error(
          text || 'Unable to update NGO profile'
        )
      }

      let data

      try {
        data = JSON.parse(text)
      } catch {
        data = null
      }

      if (data) {
        setProfile(data)
        setNgoName(data.ngoName || '')
        setAddress(data.address || '')
        setPhone(data.phone || '')
      } else {
        await loadProfile()
      }

      setMessage(
        'NGO profile updated successfully'
      )

      setEditing(false)
    } catch (err) {
      console.error(err)
      setError(
        err.message ||
          'Unable to update NGO profile'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setNgoName(profile?.ngoName || '')
    setAddress(profile?.address || '')
    setPhone(profile?.phone || '')
    setMessage('')
    setError('')
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="ngo-profile-page">
        <div className="ngo-profile-loading">
          <div className="ngo-profile-spinner"></div>
          <span>Loading NGO Profile...</span>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="ngo-profile-page">
        <div className="ngo-profile-error-card">
          <div className="ngo-profile-error-icon">
            !
          </div>

          <h2>NGO Profile Not Found</h2>

          <p>
            We could not load your NGO profile.
          </p>

          <button
            className="ngo-profile-primary-btn"
            onClick={loadProfile}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const verification =
    profile.verificationStatus || 'PENDING'

  return (
    <div className="ngo-profile-page">

      <main className="ngo-profile-content">

        <section className="ngo-profile-hero">

          <div className="ngo-profile-hero-glow ngo-glow-one"></div>
          <div className="ngo-profile-hero-glow ngo-glow-two"></div>
          <div className="ngo-profile-hero-glow ngo-glow-three"></div>

          <div className="ngo-profile-hero-main">

            <div className="ngo-profile-avatar">
              <span>♡</span>
            </div>

            <div className="ngo-profile-heading">

              <div className="ngo-profile-label">
                <span className="ngo-label-icon">
                  ✦
                </span>
                NGO PROFILE
              </div>

              <h1>
                {profile.ngoName || 'NGO'}
              </h1>

              <p>
                Manage your NGO information.
              </p>

              <div className="ngo-profile-meta">

                <div className="ngo-meta-item">
                  <span className="ngo-meta-icon">
                    ⌖
                  </span>

                  <span>
                    {profile.address || 'Address not added'}
                  </span>
                </div>

                <div className="ngo-meta-item">
                  <span className="ngo-meta-icon">
                    ☎
                  </span>

                  <span>
                    {profile.phone || 'Phone not added'}
                  </span>
                </div>

                <div
                  className={`ngo-verification-badge ${
                    verification === 'VERIFIED'
                      ? 'verified'
                      : 'pending'
                  }`}
                >
                  <span className="ngo-status-icon">
                    ✓
                  </span>

                  {verification}
                </div>

              </div>

            </div>

          </div>

          <div className="ngo-profile-hero-message">
            <span>Making</span>
            <span>A Hunger Free</span>
            <span>Tomorrow</span>

            <div className="ngo-message-line">
              <span></span>
              <b>♥</b>
              <span></span>
            </div>

            <div className="ngo-message-small-line"></div>
          </div>

        </section>

        {message && (
          <div className="ngo-profile-message success">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="ngo-profile-message error">
            <span>!</span>
            {error}
          </div>
        )}

        <section className="ngo-profile-stats">

          <div className="ngo-profile-stat stat-blue">
            <div className="ngo-stat-icon">
              <span>♟</span>
            </div>

            <div className="ngo-stat-content">
              <span>Total Meals Donated</span>
              <strong>0</strong>
              <small>
                Meals shared with those in need
              </small>
            </div>
          </div>

          <div className="ngo-profile-stat stat-purple">
            <div className="ngo-stat-icon">
              <span>♥</span>
            </div>

            <div className="ngo-stat-content">
              <span>Active Requests</span>
              <strong>0</strong>
              <small>
                Ongoing food requests
              </small>
            </div>
          </div>

          <div className="ngo-profile-stat stat-pink">
            <div className="ngo-stat-icon">
              <span>▣</span>
            </div>

            <div className="ngo-stat-content">
              <span>Completed Requests</span>
              <strong>0</strong>
              <small>
                Successfully fulfilled
              </small>
            </div>
          </div>

          <div className="ngo-profile-stat stat-violet">
            <div className="ngo-stat-icon">
              <span>★</span>
            </div>

            <div className="ngo-stat-content">
              <span>Impact Score</span>
              <strong>0</strong>
              <small>
                Lives positively impacted
              </small>
            </div>
          </div>

        </section>

        <section className="ngo-profile-editor">

          <div className="ngo-editor-header">

            <div className="ngo-editor-icon">
              ✎
            </div>

            <div>
              <h2>
                {editing
                  ? 'Edit NGO Profile'
                  : 'NGO Profile Details'}
              </h2>

              <p>
                {editing
                  ? 'Update your organization details'
                  : 'Your organization information'}
              </p>
            </div>

            {!editing && (
              <button
                className="ngo-edit-btn"
                onClick={() => {
                  setMessage('')
                  setError('')
                  setEditing(true)
                }}
              >
                ✎ Edit Profile
              </button>
            )}

          </div>

          {editing ? (
            <form
              className="ngo-profile-form"
              onSubmit={handleSave}
            >

              <div className="ngo-form-grid">

                <div className="ngo-form-group">
                  <label>
                    NGO Name
                  </label>

                  <input
                    type="text"
                    value={ngoName}
                    onChange={event =>
                      setNgoName(event.target.value)
                    }
                    placeholder="Enter NGO name"
                    required
                  />
                </div>

                <div className="ngo-form-group">
                  <label>
                    Address
                  </label>

                  <input
                    type="text"
                    value={address}
                    onChange={event =>
                      setAddress(event.target.value)
                    }
                    placeholder="Enter NGO address"
                    required
                  />
                </div>

                <div className="ngo-form-group">
                  <label>
                    Phone Number
                  </label>

                  <input
                    type="text"
                    value={phone}
                    onChange={event =>
                      setPhone(event.target.value)
                    }
                    placeholder="Enter phone number"
                    required
                  />
                </div>

              </div>

              <div className="ngo-form-actions">

                <button
                  type="button"
                  className="ngo-cancel-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="ngo-save-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="ngo-btn-spinner"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span>▣</span>
                      Save Changes
                    </>
                  )}
                </button>

              </div>

            </form>
          ) : (
            <div className="ngo-profile-details">

              <div className="ngo-detail-card">
                <span>NGO Name</span>
                <strong>
                  {profile.ngoName || 'Not added'}
                </strong>
              </div>

              <div className="ngo-detail-card">
                <span>Address</span>
                <strong>
                  {profile.address || 'Not added'}
                </strong>
              </div>

              <div className="ngo-detail-card">
                <span>Phone Number</span>
                <strong>
                  {profile.phone || 'Not added'}
                </strong>
              </div>

            </div>
          )}

        </section>

      </main>

    </div>
  )
}

export default NGOProfile