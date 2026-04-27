"use client";

import { RoomType } from "@/app/game/[roomID]/page";
import { Socket } from "socket.io-client";

const Canvas = ({ socket, roomData }: { socket: Socket; roomData: RoomType }) => {
  return (
    <div className="h-full w-full md:w-[50%] p-1 flex flex-col justify-center items-center">
      <span>Word to be guessed here</span>
      <div className="h-[60vh] md:h-[80%] w-full bg-white rounded-3xl"></div>
    </div>
  );
};

export default Canvas;
