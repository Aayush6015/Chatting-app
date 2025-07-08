import React from "react";

const Input = ({ type = "text", value, onChange, placeholder, ...rest }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
      {...rest}
    />
  );
};

export { Input };
