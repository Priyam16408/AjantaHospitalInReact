import React, { useEffect, useRef, useState } from "react";

const Marquee = ({ children, height }) => {
  const marqueeWrapperRef = useRef(null);
  const marqueeContentRef = useRef(null);
  const [animationDuration, setAnimationDuration] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const wrapperHeight = marqueeWrapperRef.current.offsetHeight;
    const contentHeight = marqueeContentRef.current.scrollHeight;

    if (contentHeight > wrapperHeight) {
      const speed = contentHeight / wrapperHeight; // Dynamic speed calculation
      const duration = speed * 5; // Adjust the multiplier as needed (5s per screen height)
      setAnimationDuration(duration); // Set dynamic animation duration
    } else {
      setAnimationDuration(null); // No animation if content is smaller
    }
  }, [children]);

  // Event handlers to manage hover state
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="marquee-wrapper"
      style={{ height: height, overflow: "hidden" }}
      ref={marqueeWrapperRef}
    >
      <div
        className="marquee-content"
        style={{
          animation: animationDuration
            ? `scroll-up ${animationDuration}s linear infinite`
            : "none",
          animationPlayState: isHovered ? "paused" : "running", // Pause/resume animation on hover
        }}
        ref={marqueeContentRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </div>
  );
};

export default Marquee;
