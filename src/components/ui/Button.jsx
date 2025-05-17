// Button.jsx
import React from "react";

const Button = ({ onClick, children, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full mt-5 text-base bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-2 font-semibold py-2 rounded ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
