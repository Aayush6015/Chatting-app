import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../../features/conversation/conversationSlice.js";
import { useMemo } from "react";

const ConversationList = ({ onConversationClick }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
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
    <ul className="m-1 divide-y">
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
            className={`p-4 m-1  hover:bg-white hover:text-black cursor-pointer rounded-2xl`}
            onClick={() => onConversationClick?.(conv)}
          >
            <div className="flex justify-around items-center text-center">
              {otherUser?.profilePicture && (
                <div className="relative w-8 h-8">
                  <img
                    src={otherUser.profilePicture}
                    alt="Profile Picture"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 left-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                  )}
                </div>
              )}
              <span>{otherUser?.username || "Unknown User"}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ConversationList;
