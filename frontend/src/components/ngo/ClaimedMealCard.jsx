function ClaimedMealCard({
  meal
}) {
  return (
    <div className="ngo-meal-card">
      <div className="ngo-meal-top">
        <div>
          <h3>
            {meal.foodName}
          </h3>

          <p>
            {meal.restaurantName}
          </p>
        </div>

        <span className="food-status">
          {meal.status}
        </span>
      </div>

      <div className="ngo-meal-details">
        <div>
          <span>Quantity</span>

          <strong>
            {meal.quantity}
          </strong>
        </div>

        <div>
          <span>Pickup</span>

          <strong>
            {meal.pickupDeadline ||
              'Not provided'}
          </strong>
        </div>
      </div>

      {meal.allergens && (
        <div className="ngo-meal-allergens">
          <span>Allergens</span>

          <strong>
            {meal.allergens}
          </strong>
        </div>
      )}

      {meal.status ===
        'READY_FOR_PICKUP' &&
        meal.pickupOtp && (
          <div className="pickup-otp-card">
            <span>
              Pickup OTP
            </span>

            <strong>
              {meal.pickupOtp}
            </strong>

            <p>
              Show this OTP to the
              restaurant during pickup.
            </p>
          </div>
        )}
    </div>
  )
}

export default ClaimedMealCard