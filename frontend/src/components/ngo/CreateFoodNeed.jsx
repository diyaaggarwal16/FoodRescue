import { useState } from 'react'

function CreateFoodNeed({
  isVerified,
  onCreate
}) {
  const [foodType, setFoodType] = useState('')
  const [quantityNeeded, setQuantityNeeded] =
    useState('')
  const [neededBy, setNeededBy] = useState('')
  const [location, setLocation] = useState('')
  const [urgency, setUrgency] = useState('NORMAL')
  const [allowPurchase, setAllowPurchase] =
    useState(false)
  const [creatingNeed, setCreatingNeed] =
    useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setCreatingNeed(true)

      await onCreate({
        foodType,
        quantityNeeded: Number(
          quantityNeeded
        ),
        neededBy,
        location,
        urgency,
        allowPurchase
      })

      setFoodType('')
      setQuantityNeeded('')
      setNeededBy('')
      setLocation('')
      setUrgency('NORMAL')
      setAllowPurchase(false)
    } finally {
      setCreatingNeed(false)
    }
  }

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <div>
          <h2>Create Food Need</h2>

          <p>
            Tell the platform what food your NGO
            currently needs.
          </p>
        </div>
      </div>

      {!isVerified ? (
        <div className="dashboard-card">
          <p>
            Your NGO must be verified before
            creating food needs.
          </p>
        </div>
      ) : (
        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>Food Type</label>

            <input
              type="text"
              value={foodType}
              onChange={(event) =>
                setFoodType(
                  event.target.value
                )
              }
              placeholder="Example: Rice meals"
              required
            />
          </div>

          <div className="form-group">
            <label>Quantity Needed</label>

            <input
              type="number"
              min="1"
              value={quantityNeeded}
              onChange={(event) =>
                setQuantityNeeded(
                  event.target.value
                )
              }
              placeholder="Example: 50"
              required
            />
          </div>

          <div className="form-group">
            <label>Needed By</label>

            <input
              type="datetime-local"
              value={neededBy}
              onChange={(event) =>
                setNeededBy(
                  event.target.value
                )
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>

            <input
              type="text"
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value
                )
              }
              placeholder="Example: Ghaziabad"
              required
            />
          </div>

          <div className="form-group">
            <label>Urgency</label>

            <select
              value={urgency}
              onChange={(event) =>
                setUrgency(
                  event.target.value
                )
              }
            >
              <option value="LOW">
                Low
              </option>

              <option value="NORMAL">
                Normal
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="URGENT">
                Urgent
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={allowPurchase}
                onChange={(event) =>
                  setAllowPurchase(
                    event.target.checked
                  )
                }
              />

              {' '}
              Allow purchase if donation is
              unavailable
            </label>
          </div>

          <button
            className="auth-btn"
            type="submit"
            disabled={creatingNeed}
          >
            {creatingNeed
              ? 'Creating...'
              : 'Create Food Need'}
          </button>
        </form>
      )}
    </section>
  )
}

export default CreateFoodNeed