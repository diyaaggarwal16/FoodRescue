import { useState } from 'react'

function AvailableMealCard({
  meal,
  foodNeeds,
  isVerified,
  onClaim,
  onFulfill
}) {
  const [selectedNeedId, setSelectedNeedId] = useState('')
  const [quantity, setQuantity] = useState('')

  const activeNeeds = foodNeeds.filter(
    need =>
      need.status === 'OPEN' ||
      need.status === 'PARTIALLY_FULFILLED'
  )

  const selectedNeed = activeNeeds.find(
    need => String(need.id) === String(selectedNeedId)
  )

  const remainingNeed = selectedNeed
    ? Math.max(
        0,
        selectedNeed.quantityNeeded -
          (selectedNeed.quantityFulfilled || 0)
      )
    : 0

  const maxQuantity = selectedNeed
    ? Math.min(meal.quantity, remainingNeed)
    : 0

  const handleFulfill = () => {
    const requestedQuantity = Number(quantity)

    if (!selectedNeedId) {
      return
    }

    if (
      !requestedQuantity ||
      requestedQuantity <= 0 ||
      requestedQuantity > maxQuantity
    ) {
      return
    }

    onFulfill(
      Number(selectedNeedId),
      meal.id,
      requestedQuantity
    )

    setSelectedNeedId('')
    setQuantity('')
  }

  return (
    <div className="ngo-meal-card">
      <h3>{meal.foodName}</h3>

      <p>{meal.restaurantName}</p>

      <div className="ngo-meal-details">
        <div>
          <span>Quantity</span>
          <strong>{meal.quantity}</strong>
        </div>

        <div>
          <span>Pickup</span>
          <strong>
            {meal.pickupDeadline || 'Not provided'}
          </strong>
        </div>
      </div>

      {meal.allergens && (
        <p>
          <strong>Allergens:</strong> {meal.allergens}
        </p>
      )}

      <button
        className="auth-btn"
        onClick={() => onClaim(meal.id)}
        disabled={!isVerified}
      >
        Claim Meal
      </button>

      {isVerified && activeNeeds.length > 0 && (
        <div className="ngo-fulfill-box">
          <label>
            Fulfill Food Need
          </label>

          <select
            value={selectedNeedId}
            onChange={event => {
              setSelectedNeedId(event.target.value)
              setQuantity('')
            }}
          >
            <option value="">
              Select a food need
            </option>

            {activeNeeds.map(need => {
              const remaining =
                need.quantityNeeded -
                (need.quantityFulfilled || 0)

              return (
                <option
                  key={need.id}
                  value={need.id}
                >
                  {need.foodType} — {remaining} remaining
                </option>
              )
            })}
          </select>

          {selectedNeed && (
            <>
              <p className="ngo-fulfill-info">
                Meal available: {meal.quantity}
                {' · '}
                Need remaining: {remainingNeed}
                {' · '}
                Maximum: {maxQuantity}
              </p>

              <input
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={event =>
                  setQuantity(event.target.value)
                }
                placeholder={`Quantity (max ${maxQuantity})`}
              />

              <button
                className="auth-btn"
                onClick={handleFulfill}
                disabled={
                  !quantity ||
                  Number(quantity) <= 0 ||
                  Number(quantity) > maxQuantity
                }
              >
                Fulfill Need
              </button>
            </>
          )}
        </div>
      )}

      {isVerified && activeNeeds.length === 0 && (
        <p className="ngo-empty-state">
          No open food needs available.
        </p>
      )}
    </div>
  )
}

export default AvailableMealCard