import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'

function Banner() {
  return (
    <Carousel
      autoPlay
      infiniteLoop
      showStatus={false}
      showIndicators={false}
      showThumbs={false}
      interval={3000}
    >
      <div>
        <img src="/assets/camera.jpg" loading="lazy" />
      </div>
      <div>
        <img src="/assets/macbook.jpg" loading="lazy" />
      </div>
      <div>
        <img src="/assets/iphone13.jpg" loading="lazy" />
      </div>
      <div>
        <img src="/assets/ps4.jpg" loading="lazy" />
      </div>
    </Carousel>
  )
}

export default Banner
