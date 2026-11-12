import React, { useState, useEffect } from 'react';
import image from "../../assets/image/billcloseicone.png";

const BillCloseUI = () => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsShown(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className=" d-flex  justify-content-center bg-body-tertiary p-4">
      <div
        className={`card text-center  border-0 animated-card ${
          isShown ? 'fade-in-up' : ''
        }`}
        style={{ maxWidth: '500px' }}
      >
        <div className="card-body p-5">

          {/* Circle Image Icon */}
          <div
            className="mx-auto mb-4 d-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle"
            style={{ width: '90px', height: '90px' }}
          >
            <img
              src={image}
              alt="Lock Icon"
              className="img-fluid"
              style={{ width: '50px' }}
            />
          </div>

          {/* Title */}
          <h3 className="card-title fw-bold text-dark mb-3">
            Bill Finalized & Locked
          </h3>

          {/* Message */}
          <p className="text-secondary fs-5 mb-0">
            The patient’s bill has been finalized. Therefore, no further
            modifications or doctor shifting are possible.
          </p>
        </div>
      </div>

      {/* Animation CSS */}
      <style>{`
        .animated-card {
          transform: translateY(30px);
          opacity: 0;
          transition: all 0.6s ease-in-out;
        }
        .fade-in-up {
          transform: translateY(0);
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default BillCloseUI;




// import React, { useState, useEffect } from 'react';
// import { FaLock } from 'react-icons/fa'; // Using the same icon library
// import image from "../../assets/image/billcloseicone.png"
// const BillCloseUI = () => {
//   // State to control the fade-in animation
//   const [isShown, setIsShown] = useState(false);

//   useEffect(() => {
//     // After the component mounts, set isShown to true to trigger the animation.
//     // A small timeout ensures the transition happens smoothly.
//     const timer = setTimeout(() => {
//       setIsShown(true);
//     }, 100);

//     // Cleanup function to clear the timer if the component unmounts
//     return () => clearTimeout(timer);
//   }, []); // The empty array ensures this effect runs only once

//   return (
//     // Full-screen container to center the card vertically and horizontally
//     <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      
//       {/* 
//         Bootstrap Card Component
//         - 'fade' class prepares the element for a fade transition.
//         - 'show' class makes it visible. We add this class dynamically.
//       */}
//       <div 
//         className={`card shadow-lg border-0 text-center fade ${isShown ? 'show' : ''}`} 
//         style={{ maxWidth: '450px', borderTop: '5px solid var(--bs-danger)' }}
//       >
//         <div className="card-body p-5">
          
//           {/* Icon Container */}
//           <div 
//             className="mx-auto d-flex align-items-center justify-content-center bg-danger-subtle rounded-circle mb-4" 
//             style={{ width: '80px', height: '80px' }}
//           >
//             <img src={image} alt=""  className='w-[100px]'/>
           
//           </div>

//           {/* Heading */}
//           <h2 className="card-title fw-bold text-dark mb-3">
//             Bill Finalized & Locked
//           </h2>
          
//           {/* Message */}
//           <p className="card-text text-muted fs-5">
//             The patient’s bill has been finalized. Therefore, no further modifications or doctor shifting are possible.
//           </p>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillCloseUI;



// import React from 'react';
// import { MdErrorOutline } from 'react-icons/md';

// const BillCloseUI = () => {
//   return (
//     <div className="flex justify-center items-center h-full p-4">
//       <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-md shadow-md max-w-xl flex items-center gap-3">
//         <MdErrorOutline className="text-2xl text-red-600" />
//         <span className="font-medium text-lg">
//           Patient’s Bill has been <strong>freezed</strong>. No Doctor Shifting can be possible…
//         </span>
//       </div>
//     </div>
//   );
// };

// export default BillCloseUI;



// import React from 'react'

// const BillCloseUI = () => {
//   return (
//     <div>
//         "Patient’s Bill has been freezed. No Doctor Shifting can be possible…"
//     </div>
//   )
// }

// export default BillCloseUI