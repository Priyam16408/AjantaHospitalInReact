import React, { useState, useEffect } from "react";
import "./Carousel.css";
import img1 from "./../../assets/image/img1.jpg";
import img2 from "./../../assets/image/img2.jpg";
import img3 from "./../../assets/image/img3.jpg";
import img4 from "./../../assets/image/img4.jpg";
import LoginComponent from "./LoginComponent";
const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, title: "Slide 1", imgUrl: img1 },
    { id: 2, title: "Slide 2", imgUrl: img2 },
    { id: 3, title: "Slide 3", imgUrl: img3 },
    { id: 4, title: "Slide 4", imgUrl: img4 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000); // Auto-slide every 3 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="outer-Container">
      <div
        className="carousel-slides"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div className="carousel-slide" key={slide.id}>
            <img src={slide.imgUrl} alt={slide.title} />
            {/* <h2>{slide.title}</h2> */}
          </div>
        ))}
      </div>
      <div className="login-container">
        <LoginComponent />
      </div>
      {/* Navigation buttons */}
      <button className="carousel-btn prev" onClick={goToPrevSlide}>
        &#10094;
      </button>
      <button className="carousel-btn next" onClick={goToNextSlide}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;



















