
import React from "react";
import { useSelector } from "react-redux";

const MessageBubble = ({ message }) => {
  const { user } = useSelector((state) => state.auth);
  const isSender = message.sender._id === user._id;

  return (
    // <div className={`flex mb-0.5 ${isSender ? "justify-end" : "justify-start"}`}>
    <div className={"w-full"}>
      <div
        className={`max-w-[95%] items-center my-0 pl-5 pr-0 py-0.5 rounded-xl text-l  relative `}
      >
        <div className="font-semibold">{message.content}</div>
        <div className=" text-xs text-right mt-1"> 
          {message.edited && (<span className="text-xs  text-gray-400"> edited   </span>)}
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

