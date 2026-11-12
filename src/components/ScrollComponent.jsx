import React, { useEffect, useState } from "react";

const ScrollComponent = ({ children, viewPort }) => {
  const [height, setHeight] = useState(window.innerHeight * viewPort); // Initial height set to 80% of the viewport

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight * viewPort); // Update height on window resize
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on unmount
    };
  }, []);

  return (
    <div
      style={{ height: `${height}px` }}
      className="dashboard-scroll"
      id="dashboard-scroll"
    >
      {children}
    </div>
  );
};

export default ScrollComponent;
