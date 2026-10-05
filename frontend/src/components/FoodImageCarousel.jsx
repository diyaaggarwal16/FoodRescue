import { useEffect, useMemo, useState } from 'react'

function FoodImageCarousel({
  food,
  className = ''
}) {
  const images = useMemo(() => {
    return [
      food?.image1Url,
      food?.image2Url,
      food?.image3Url
    ].filter(Boolean)
  }, [
    food?.image1Url,
    food?.image2Url,
    food?.image3Url
  ])

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setCurrentIndex(0)
  }, [food?.id])

  useEffect(() => {
    if (images.length <= 1) {
      return
    }

    const timer = setInterval(() => {
      setCurrentIndex((current) =>
        (current + 1) % images.length
      )
    }, 4000)

    return () => clearInterval(timer)
  }, [images.length])

  const getImageUrl = (url) => {
    if (!url) {
      return ''
    }

    if (
      url.startsWith('http://') ||
      url.startsWith('https://')
    ) {
      return url
    }

    return `http://localhost:8080${url}`
  }

  const previousImage = () => {
    setCurrentIndex((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    )
  }

  const nextImage = () => {
    setCurrentIndex((current) =>
      (current + 1) % images.length
    )
  }

  if (images.length === 0) {
    return (
      <div className={`food-image food-image-empty ${className}`}>
        <span>FoodRescue</span>
      </div>
    )
  }

  return (
    <div className={`food-image-carousel ${className}`}>
      <img
        src={getImageUrl(images[currentIndex])}
        alt={food?.foodName || 'Food'}
        className="food-carousel-image"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="food-carousel-arrow food-carousel-prev"
            onClick={previousImage}
            aria-label="Previous image"
          >
            ‹
          </button>

          <button
            type="button"
            className="food-carousel-arrow food-carousel-next"
            onClick={nextImage}
            aria-label="Next image"
          >
            ›
          </button>

          <div className="food-carousel-dots">
            {images.map((_, index) => (
              <button
                type="button"
                key={index}
                className={`food-carousel-dot${
                  index === currentIndex
                    ? ' active'
                    : ''
                }`}
                onClick={() =>
                  setCurrentIndex(index)
                }
                aria-label={`Show image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default FoodImageCarousel