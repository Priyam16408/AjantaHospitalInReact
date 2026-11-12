import React from "react";


function Button({ name, type, className ,handleClick}) {
  return (
    <button type={type} className={className} onClick={handleClick}>
      {name}
    </button>
  );
}

export default Button;
