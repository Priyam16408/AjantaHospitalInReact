import React, { useState, useRef, useEffect } from "react";
import { notify } from "../../utils/utils";

function SeeMore({ Header, children, docterError, isVisibleOldPrescription }) {
  // console.log("sakdjkadjiasdias",docterError);

  const [show, setShow] = useState(isVisibleOldPrescription || false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShow(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);



  const handleShow = () => {
    // () => setShow(!show, notify("g", "error"))
    // setShow(!show)
    console.log("doctorError:", docterError);
    if (docterError === 1) {
      notify("You are not a doctor", "error")
      // setShow(false)
    }
    else {
      setShow(!show)
    }
  }

  useEffect(() => {
    setShow(isVisibleOldPrescription);
  }, [isVisibleOldPrescription]); 

  return (
    <div
      className="d-flex align-items-center justify-content-end"
      style={{ position: "relative", }}
    >
      <div ref={ref}>
        <div style={{ cursor: "pointer" }} onClick={handleShow}>
          {Header}
        </div>
        {show && (
          <div
            style={{
              position: "absolute",
              backgroundColor: "white",
              boxShadow: "0px 0px 5px",
              borderRadius: "5px",
              top: "18px",
              zIndex: 9999,
              right: "4px",
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default SeeMore;
