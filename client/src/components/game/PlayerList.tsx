"use client";

import { PlayerType } from "@/app/game/[roomID]/page";
import { Socket } from "socket.io-client";

import { useEffect } from "react";

const PlayerList = ({ socket, playerList }: { socket: Socket | null; playerList: PlayerType[] }) => {

  return (
    <div className="h-full w-full md:w-[20%] p-1 flex flex-col justify-center items-center gap-y-2 overflow-y-scroll overflow-x-hidden">
      <span>Active Players : {playerList.length || 0}</span>
      {playerList &&
        playerList.map((user) => (
          <div
            key={user.username}
            className="w-full text-left flex flex-row justify-between items-center border p-1 rounded-full"
          >
            <span className="ml-2">{user.username}</span>
            <span className="mr-1">{user.score}</span>
          </div>
        ))}
    </div>
  );
};

export default PlayerList;
