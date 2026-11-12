import React from 'react';
import { Carousel } from 'react-bootstrap';
import BlueBannerImage from '@app/assets/image/BlueBanner.jpg';
import HospediaImage from '@app/assets/image/Hospedia.jpg';

const CarouselComponent = () => {
  const images = [
    BlueBannerImage,
    HospediaImage,
    BlueBannerImage,
  ];

  return (
    <div >
      <Carousel interval={2000}>
        {images.map((image, index) => (
          <Carousel.Item key={index}>
            <img className="d-block w-100" src={image} alt={`Slide ${index}`} />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
