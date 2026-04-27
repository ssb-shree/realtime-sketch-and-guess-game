"use client";

import { RoomType } from "@/app/game/[roomID]/page";
import { Socket } from "socket.io-client";

const ChatBox = ({ socket, roomData }: { socket: Socket ; roomData: RoomType }) => {
  return (
    <div className="h-[40vh] md:h-[90%] w-full md:w-[30%] border-2 rounded-lg flex flex-col">
      <div className="h-full w-full p-1 overflow-y-scroll">text inside this div</div>

      {/* input */}
      <div className="p-2 border-t bottom-0">
        <input type="text" placeholder="Type..." className="input input-bordered w-full" />
      </div>
    </div>
  );
};

export default ChatBox;
