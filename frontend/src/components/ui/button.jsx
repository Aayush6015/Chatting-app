import React from "react";

const Button = ({ children, onClick, type = "button", ...rest }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      {...rest}
    >
      {children}
    </button>
  );
};

export { Button };
