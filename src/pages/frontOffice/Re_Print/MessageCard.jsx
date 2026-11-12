import React, { useEffect, useState } from "react";

const MessageCard = ({ header, children, key }) => {
  const [show, setShow] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleClose = () => {
    setShow(false);
  };

  const clearTimeOut = (timeout) => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        setShow(false);
      }, 5000);

      setTimeoutId(timeout);

      return () => clearTimeOut(timeout);
    }
  }, [show, key]);

  return (
    show && (
      <>
        <div
          className="notification-content"
          onMouseEnter={() => clearTimeOut(timeoutId)}
          onMouseLeave={() => {
            const timeout = setTimeout(() => {
              setShow(false);
            }, 5000);
            setTimeoutId(timeout);
          }}
          key={key}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>{header}</div>
            <i className="fa fa-times" aria-hidden="true" onClick={handleClose}></i>
          </div>
          <div>
            <div>{children}</div>
          </div>
        </div>
      </>
    )
  );
};

export default MessageCard;
