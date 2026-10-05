import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="foodrescue-home">

      <section className="foodrescue-hero">
        <div className="foodrescue-hero-content">

          <div className="foodrescue-badge">
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
            FoodRescue connects surplus food from restaurants, bakeries
            and cafes with people who can use it — before it becomes waste.
          </p>

          <div className="foodrescue-hero-buttons">
            <button
              className="foodrescue-primary-btn"
              onClick={() => navigate('/register')}
            >
              Get Started
              <span>→</span>
            </button>

            <button
              className="foodrescue-secondary-btn"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>

          <div className="foodrescue-hero-note">
            <span>✦</span>
            Making good food reach more people.
          </div>

        </div>
      </section>

      <section className="foodrescue-features">

        <div className="foodrescue-feature-card">
          <div className="foodrescue-feature-dot restaurant-dot">
            ♨
          </div>

          <h3>For Restaurants & Cafes</h3>

          <p>
            Reduce food waste, get tax benefits and make a difference.
          </p>

          <button
            onClick={() => navigate('/register/restaurant')}
            className="foodrescue-card-arrow restaurant-arrow"
          >
            →
          </button>
        </div>

        <div className="foodrescue-feature-card">
          <div className="foodrescue-feature-dot people-dot">
            ●●
          </div>

          <h3>For People in Need</h3>

          <p>
            Access fresh, safe and nutritious food at no or low cost.
          </p>

          <button
            onClick={() => navigate('/register/customer')}
            className="foodrescue-card-arrow people-arrow"
          >
            →
          </button>
        </div>

        <div className="foodrescue-feature-card">
          <div className="foodrescue-feature-dot planet-dot">
            ◇
          </div>

          <h3>For a Greener Tomorrow</h3>

          <p>
            Less food waste means a healthier planet.
          </p>

          <button
            className="foodrescue-card-arrow planet-arrow"
            onClick={() => navigate('/register')}
          >
            →
          </button>
        </div>

        <div className="foodrescue-feature-card">
          <div className="foodrescue-feature-dot impact-dot">
            ♥
          </div>

          <h3>Community Impact</h3>

          <p>
            Be a part of a bigger change. Together we can do more.
          </p>

          <button
            className="foodrescue-card-arrow impact-arrow"
            onClick={() => navigate('/register')}
          >
            →
          </button>
        </div>

      </section>

      <section className="foodrescue-stats">

        <div className="foodrescue-stat">
          <div className="foodrescue-stat-icon stat-green">
            ♨
          </div>

          <div>
            <strong>12,450+</strong>
            <span>Meals Saved</span>
          </div>
        </div>

        <div className="foodrescue-stat">
          <div className="foodrescue-stat-icon stat-purple">
            ●●
          </div>

          <div>
            <strong>3,200+</strong>
            <span>People Helped</span>
          </div>
        </div>

        <div className="foodrescue-stat">
          <div className="foodrescue-stat-icon stat-blue">
            ◇
          </div>

          <div>
            <strong>8,900+</strong>
            <span>Kg CO₂ Reduced</span>
          </div>
        </div>

        <div className="foodrescue-stat">
          <div className="foodrescue-stat-icon stat-pink">
            ♥
          </div>

          <div>
            <strong>250+</strong>
            <span>Partner Restaurants</span>
          </div>
        </div>

      </section>

      <footer className="foodrescue-footer">

        <div className="foodrescue-footer-brand">
          FoodRescue
        </div>

        <div className="foodrescue-footer-links">
          <button onClick={() => navigate('/')}>Home</button>
          <button>About</button>
          <button onClick={() => navigate('/login')}>Dashboard</button>
          <button>Contact</button>
        </div>

      </footer>

    </div>
  )
}

export default Home