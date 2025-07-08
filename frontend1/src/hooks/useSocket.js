import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useSocket = (token) => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_BACKEND_URL, {
      auth: { token },
    });
    return () => socket.current.disconnect();
  }, [token]);

  return socket.current;
};