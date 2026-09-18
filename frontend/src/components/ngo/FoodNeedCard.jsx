function FoodNeedCard({
  need
}) {
  const remaining =
    Math.max(
      0,
      need.quantityNeeded -
        need.quantityFulfilled
    )

  return (
    <div className="ngo-meal-card">
      <div className="ngo-meal-top">
        <div>
          <h3>
            {need.foodType}
          </h3>

          <p>
            {need.location}
          </p>
        </div>

        <span className="food-status">
          {need.status}
        </span>
      </div>

      <div className="ngo-meal-details">
        <div>
          <span>Needed</span>

          <strong>
            {need.quantityNeeded}
          </strong>
        </div>

        <div>
          <span>Fulfilled</span>

          <strong>
            {need.quantityFulfilled}
          </strong>
        </div>
      </div>

      <div className="ngo-meal-details">
        <div>
          <span>Remaining</span>

          <strong>
            {remaining}
          </strong>
        </div>

        <div>
          <span>Urgency</span>

          <strong>
            {need.urgency}
          </strong>
        </div>
      </div>

      <p>
        Needed by: {need.neededBy}
      </p>

      <p>
        Purchase allowed:{' '}
        {need.allowPurchase
          ? 'Yes'
          : 'No'}
      </p>
    </div>
  )
}

export default FoodNeedCard