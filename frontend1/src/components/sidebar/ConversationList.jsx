import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../../features/conversation/conversationSlice.js";
import { useMemo } from "react";

const ConversationList = ({ onConversationClick }) => {
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.auth.user);
  const userId = user._id;
  // console.log(userId)
  // const userId = useMemo(() => user?._id, [user]);
  const { list, loading, error } = useSelector((state) => state.conversations);
  // console.log(list);
  const onlineUsers = useSelector((state) => state.onlineUsers.list);
  // const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchConversations({ page: 1, limit: 10 }));
  }, [dispatch]);

  if (loading || !user || !userId) {
    return <div className="p-4 text-gray-500">Loading conversations...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <ul className="divide-y">
      {list?.map((conv) => {
        // ✅ Identify the other participant (excluding current user)
        const otherUser = conv.participants?.find(
          (p) => String(p._id) !== String(userId)
          
        );
        console.log(otherUser._id);

        const isOnline = otherUser && onlineUsers.includes(otherUser?._id);

        return (
          <li
            key={conv._id}
            className="p-4 hover:bg-gray-100 cursor-pointer"
            onClick={() => onConversationClick?.(conv)}
          >
            <div className="flex justify-between items-center">
              <span>{otherUser?.username || "Unknown User"}</span>
              <span
                className={`text-xs ${
                  isOnline ? "text-green-500" : "text-gray-500"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ConversationList;
