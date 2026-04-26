import { initSocket } from "@/services/socket";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      socketRef.current = null;
    };
  }, [socketRef]);

  return socketRef.current;
};
