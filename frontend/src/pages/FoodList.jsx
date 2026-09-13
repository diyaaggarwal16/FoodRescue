function FoodList() {
  const foodItems = [
    {
      id: 1,
      name: 'Fresh Sandwich Box',
      restaurant: 'The Daily Bakery',
      originalPrice: 200,
      rescuePrice: 80,
      quantity: 12,
      pickupTime: 'Pickup before 9:00 PM'
    },
    {
      id: 2,
      name: 'Veg Pizza',
      restaurant: 'Urban Slice',
      originalPrice: 350,
      rescuePrice: 140,
      quantity: 8,
      pickupTime: 'Pickup before 10:00 PM'
    },
    {
      id: 3,
      name: 'Assorted Pastries',
      restaurant: 'Sweet Crumbs',
      originalPrice: 250,
      rescuePrice: 100,
      quantity: 15,
      pickupTime: 'Pickup before 8:30 PM'
    }
  ]

  return (
    <div className="food-page">
      <div className="food-header">
        <h1>Available Food Near You</h1>

        <p>
          Discover quality surplus food at affordable prices.
        </p>
      </div>

      <div className="food-grid">
        {foodItems.map((food) => (
          <div className="food-card" key={food.id}>
            <div className="food-image">
              Food
            </div>

            <div className="food-content">
              <h2>{food.name}</h2>

              <p className="restaurant-name">
                {food.restaurant}
              </p>

              <div className="price">
                <span className="original-price">
                  ₹{food.originalPrice}
                </span>

                <span className="rescue-price">
                  ₹{food.rescuePrice}
                </span>
              </div>

              <p className="quantity">
                {food.quantity} portions available
              </p>

              <p className="pickup-time">
                {food.pickupTime}
              </p>

              <button className="reserve-btn">
                Reserve Food
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FoodList