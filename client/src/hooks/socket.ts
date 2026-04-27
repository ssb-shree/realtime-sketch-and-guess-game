import { initSocket } from "@/services/socket";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useSocket = () => {
  if (socket) {
    return socket;
  }

  socket = initSocket();
  return socket;
};
