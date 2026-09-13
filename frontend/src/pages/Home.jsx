import { useNavigate } from 'react-router-dom'
function Home() {
  const navigate = useNavigate()
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="badge">
            Fighting Food Waste Together
          </div>

          <h1>
            Save Food.
            <br />
            <span>Save Money.</span>
            <br />
            Save the Planet.
          </h1>

          <p>
            FoodRescue connects surplus food from restaurants,
            bakeries, and cafes with people who can use it before
            it becomes waste.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">
              Explore Food
            </button>

            <button className="secondary-btn">
              Join as a Restaurant
            </button>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <h2>10K+</h2>
          <p>Meals Rescued</p>
        </div>

        <div className="stat-card">
          <h2>250+</h2>
          <p>Partner Restaurants</p>
        </div>

        <div className="stat-card">
          <h2>5K+</h2>
          <p>Happy Users</p>
        </div>

        <div className="stat-card">
          <h2>2 Tons</h2>
          <p>Food Waste Reduced</p>
        </div>
      </section>
    </div>
  )
}

export default Home