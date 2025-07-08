import React from "react";

export const ScrollArea = ({ children, className = "", style = {} }) => {
  return (
    <div
      className={`overflow-y-auto max-h-[400px] pr-2 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
