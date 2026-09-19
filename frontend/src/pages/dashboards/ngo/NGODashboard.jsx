import { useEffect, useState } from 'react'
import { apiFetch } from '../../../utils/api'
import NGOStats from '../../../components/ngo/NGOStats'
import CreateFoodNeed from '../../../components/ngo/CreateFoodNeed'
import FoodNeedList from '../../../components/ngo/FoodNeedList'
import AvailableMealCard from '../../../components/ngo/AvailableMealCard'
import ClaimedMealCard from '../../../components/ngo/ClaimedMealCard'

function NGODashboard() {
  const [profile, setProfile] = useState(null)
  const [availableMeals, setAvailableMeals] = useState([])
  const [claimedMeals, setClaimedMeals] = useState([])
  const [foodNeeds, setFoodNeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadDashboard = async () => {
    try {
      setLoading(true)

      const profileResponse = await apiFetch(
        '/api/ngos/my-profile'
      )

      if (profileResponse.ok) {
        const profileData =
          await profileResponse.json()

        setProfile(profileData)
      }

      const availableResponse = await apiFetch(
        '/api/donated-meals/available'
      )

      if (availableResponse.ok) {
        const availableData =
          await availableResponse.json()

        setAvailableMeals(availableData)
      }

      const claimedResponse = await apiFetch(
        '/api/donated-meals/my-claimed'
      )

      if (claimedResponse.ok) {
        const claimedData =
          await claimedResponse.json()

        setClaimedMeals(claimedData)
      }

      const needsResponse = await apiFetch(
        '/api/food-needs/my'
      )

      if (needsResponse.ok) {
        const needsData =
          await needsResponse.json()

        setFoodNeeds(needsData)
      }
    } catch (error) {
      console.error(error)

      setMessage(
        'Unable to load NGO dashboard'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const claimMeal = async (mealId) => {
    try {
      setMessage('')

      const response = await apiFetch(
        `/api/donated-meals/${mealId}/claim`,
        {
          method: 'PUT'
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(
          data || 'Unable to claim meal'
        )

        return
      }

      setMessage(
        'Meal claimed successfully'
      )

      await loadDashboard()
    } catch (error) {
      console.error(error)

      setMessage(
        'Unable to claim meal'
      )
    }
  }

  const createFoodNeed = async (foodNeed) => {
    try {
      setMessage('')

      const response = await apiFetch(
        '/api/food-needs',
        {
          method: 'POST',
          body: JSON.stringify(foodNeed)
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(
          data ||
            'Unable to create food need'
        )

        return
      }

      setMessage(
        'Food need created successfully'
      )

      await loadDashboard()
    } catch (error) {
      console.error(error)

      setMessage(
        'Unable to create food need'
      )
    }
  }

  const fulfillNeed = async (
    foodNeedId,
    donatedMealId,
    quantity
  ) => {
    try {
      setMessage('')

      if (
        !quantity ||
        Number(quantity) <= 0
      ) {
        setMessage(
          'Please enter a valid quantity'
        )

        return
      }

      const response = await apiFetch(
        `/api/food-need-fulfillments?foodNeedId=${foodNeedId}&donatedMealId=${donatedMealId}&quantity=${Number(quantity)}`,
        {
          method: 'POST'
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(
          data ||
            'Unable to fulfill food need'
        )

        return
      }

      setMessage(
        'Food need fulfilled successfully'
      )

      await loadDashboard()
    } catch (error) {
      console.error(error)

      setMessage(
        'Unable to fulfill food need'
      )
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <h1>NGO Dashboard</h1>
        <p>Loading...</p>
      </div>
    )
  }

  const isVerified =
    profile?.verificationStatus ===
    'VERIFIED'

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>NGO Dashboard</h1>

          <p>
            Manage donated meals and food
            needs.
          </p>
        </div>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {!profile ? (
        <div className="dashboard-card">
          <h2>NGO Profile Required</h2>

          <p>
            Please create your NGO profile
            before using NGO services.
          </p>
        </div>
      ) : (
        <>
          <NGOStats
            verificationStatus={
              profile.verificationStatus
            }
            availableMealsCount={
              availableMeals.length
            }
            claimedMealsCount={
              claimedMeals.length
            }
            foodNeedsCount={
              foodNeeds.length
            }
          />

          <CreateFoodNeed
            isVerified={isVerified}
            onCreate={createFoodNeed}
          />

          <FoodNeedList
            foodNeeds={foodNeeds}
          />

          <section className="dashboard-section">
            <div className="section-header">
              <div>
                <h2>
                  Available Donated Meals
                </h2>

                <p>
                  Meals available for
                  verified NGOs to claim.
                </p>
              </div>
            </div>

            {!isVerified && (
              <div className="dashboard-card">
                <p>
                  Your NGO must be verified
                  before you can claim
                  donated meals.
                </p>
              </div>
            )}

            {availableMeals.length === 0 ? (
              <div className="dashboard-card">
                <p>
                  No donated meals are
                  currently available.
                </p>
              </div>
            ) : (
              <div className="ngo-meal-grid">
                {availableMeals.map(
                  (meal) => (
                    <AvailableMealCard
                      key={meal.id}
                      meal={meal}
                      foodNeeds={foodNeeds}
                      isVerified={isVerified}
                      onClaim={claimMeal}
                      onFulfill={fulfillNeed}
                    />
                  )
                )}
              </div>
            )}
          </section>

          <section className="dashboard-section">
            <div className="section-header">
              <div>
                <h2>My Claimed Meals</h2>

                <p>
                  Donated meals already
                  claimed by your NGO.
                </p>
              </div>
            </div>

            {claimedMeals.length === 0 ? (
              <div className="dashboard-card">
                <p>
                  You have not claimed any
                  meals yet.
                </p>
              </div>
            ) : (
              <div className="ngo-meal-grid">
                {claimedMeals.map(
                  (meal) => (
                    <ClaimedMealCard
                      key={meal.id}
                      meal={meal}
                    />
                  )
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default NGODashboard

