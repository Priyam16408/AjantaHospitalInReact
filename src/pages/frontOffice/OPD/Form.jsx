// Form.js (continued)
import React, { useState, useEffect } from 'react';

const Form = () => {
  const [formData, setFormData] = useState({
    // Your form data state
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Save form data function
  const saveFormData = () => {
    // Implement your save logic here
    console.log('Form data saved:', formData);
  };

  // Event listener to detect "Control + S" keypress
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault(); // Prevent browser's default save action
        saveFormData();
        console.log("sss")
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <h2>Form</h2>
      <form>
        {/* Your form inputs */}
        <input type="text" name="name" placeholder="Name" onChange={handleInputChange} />
        {/* Add more form inputs as needed */}
      </form>
    </div>
  );
};

export default Form;
