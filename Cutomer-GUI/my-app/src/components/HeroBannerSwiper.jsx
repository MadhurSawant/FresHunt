import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './HeroBanner.css';

// Example image paths (put inside /public/images or import from /src/assets)


const bannerImages = [
  '/assets/p1.jpeg',
  '/assets/p2.jpeg',
  '/assets/p3.jpeg'
];;


const HeroBannerSwiper = () => {
  return (
    <div className="hero-swiper-container">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {bannerImages.map((imageUrl, index) => (
          <SwiperSlide key={index}>
            <img src={imageUrl} alt={`Slide ${index}`} className="hero-img" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBannerSwiper;
