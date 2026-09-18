import FoodNeedCard from './FoodNeedCard'

function FoodNeedList({
  foodNeeds
}) {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <div>
          <h2>My Food Needs</h2>

          <p>
            Track your current food
            requirements.
          </p>
        </div>
      </div>

      {foodNeeds.length === 0 ? (
        <div className="dashboard-card">
          <p>
            You have not created any food
            needs yet.
          </p>
        </div>
      ) : (
        <div className="ngo-meal-grid">
          {foodNeeds.map((need) => (
            <FoodNeedCard
              key={need.id}
              need={need}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default FoodNeedList