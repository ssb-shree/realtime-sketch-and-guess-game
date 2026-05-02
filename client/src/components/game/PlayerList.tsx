"use client";

import { PlayerType, RoomType } from "@/app/game/[roomID]/page";
import { Socket } from "socket.io-client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/store/user";

const PlayerList = ({ socket, roomData }: { socket: Socket; roomData: RoomType }) => {
  const { username } = useUserStore();

  const router = useRouter();

  useEffect(() => {
    return () => {
      socket.off("leave-room");
      socket.off("start-game");
    };
  }, []);

  const leaveRoom = () => {
    socket.emit("leave-room");
    router.push("/");
  };

  const startGame = () => {
    socket.emit("start-game", {roomID : roomData.id});
  };

  return (
    <div className="h-full w-full md:w-[20%] p-1 flex flex-col justify-center items-center gap-y-2 overflow-y-scroll overflow-x-hidden">
      <span>Active Players : {roomData.players.length || 0}</span>
      {roomData.owner.username === username && (
        <button onClick={startGame} className="btn w-full btn-primary ">
          Start Game
        </button>
      )}
      <button onClick={leaveRoom} className="btn w-full btn-accent ">
        {roomData.owner.username === username ? "End Room" : "Leave Room"}
      </button>
      {roomData.players &&
        roomData.players.map((user) => (
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
