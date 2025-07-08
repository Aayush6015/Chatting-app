import React from "react";

const Loader = ({ size = "w-10 h-10", text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`animate-spin rounded-full border-4 border-t-transparent border-blue-500 ${size}`} />
      {text && <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{text}</p>}
    </div>
  );
};

export default Loader;
