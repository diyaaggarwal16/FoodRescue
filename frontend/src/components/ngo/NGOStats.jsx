function NGOStats({
  verificationStatus,
  availableMealsCount,
  claimedMealsCount,
  foodNeedsCount
}) {
  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <span>Verification</span>
        <strong>
          {verificationStatus || 'PENDING'}
        </strong>
      </div>

      <div className="stat-card">
        <span>Available Meals</span>
        <strong>
          {availableMealsCount}
        </strong>
      </div>

      <div className="stat-card">
        <span>My Claimed Meals</span>
        <strong>
          {claimedMealsCount}
        </strong>
      </div>

      <div className="stat-card">
        <span>Food Needs</span>
        <strong>
          {foodNeedsCount}
        </strong>
      </div>
    </div>
  )
}

export default NGOStats