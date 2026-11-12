import React, { useState, useEffect } from 'react';

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (event) => {
      setError(event?.error || new Error('An error occurred'));
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (error) {
    return (
      <>
        <div className='errorBoundary'>
          <div>
            <h2>Something went wrong:</h2>
            <p>Error message: {error?.message}</p>
            <p>Error stack trace:</p>
            <pre>{error?.stack}</pre>
          </div>
        </div>
      </>
    );
  }

  return children;
}

export default ErrorBoundary;



























