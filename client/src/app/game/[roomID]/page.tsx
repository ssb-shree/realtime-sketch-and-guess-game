"use client";
import { useSocket } from "@/hooks/socket";

import { useRouter, useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";

export type RoomType = {
  id: string;
  players: PlayerType[];
  owner: PlayerType;
  guessWord: string;
  canvasState: any;
  status: "started" | "waiting";
};

export type PlayerType = {
  id: string;
  username: string;
  score: number;
  inRoom: string;
};

const GameRoom = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const { roomID } = useParams<{ roomID: string }>();

  const username = searchParams.get("username");

  // make a socket connection
  const socket = useSocket();

  const [roomState, setRoomState] = useState<RoomType>();

  useEffect(() => {
    if (!socket) return;

    return () => {
      console.log("user left page 2");
      socket.emit("leave-room", { roomID });
    };
  }, []); // <-- only once

  useEffect(() => {
    if (!socket) {
      toast.error("socket connection failed");
      return;
    }

    checkEmptyOrInvalidValues({ roomID, username });

    joinRoom({ roomID, username, socket });

    socket.on("room-joined", ({ roomData }: { roomData: RoomType }) => {
      setRoomState(roomData);
    });
    socket.on("update-room-data", (roomData: RoomType) => {
      setRoomState(roomData);
    });

    socket.on("user-left", ({ roomData }: { roomData: RoomType }) => {
      setRoomState(roomData);
    });

    return () => {
      socket.off("room-joined");
      socket.off("update-room-data");
      socket.off("user-left");
    };
  }, [socket, username, roomID]);

  return (
    <section className="min-h-screen md:h-screen w-screen flex flex-col md:flex-row justify-center items-center p-1">
      <div className="h-full w-full md:w-[20%] p-1 flex flex-col justify-center items-center gap-y-2 overflow-y-scroll overflow-x-hidden">
        <span>Active Players : {roomState?.players.length || 0}</span>
        {roomState &&
          roomState.players.map((user) => (
            <div
              key={user.username}
              className="w-full text-left flex flex-row justify-between items-center border p-1 rounded-full"
            >
              <span className="ml-2">{user.username}</span>
              <span className="mr-1">{user.score}</span>
            </div>
          ))}
      </div>
      <div className="h-full w-full md:w-[50%] p-1 flex flex-col justify-center items-center">
        <span>Word to be guessed here</span>
        <div className="h-[60vh] md:h-[80%] w-full bg-white rounded-3xl"></div>
      </div>
      <div className="h-[40vh] md:h-[90%] w-full md:w-[30%] border-2 rounded-lg flex flex-col">
        <div className="h-full w-full p-1 overflow-y-scroll">text inside this div</div>

        {/* input */}
        <div className="p-2 border-t bottom-0">
          <input type="text" placeholder="Type..." className="input input-bordered w-full" />
        </div>
      </div>
    </section>
  );
};

export default GameRoom;

// helper functions below

const checkEmptyOrInvalidValues = ({ roomID, username }: { roomID: string; username: string | null }) => {
  if (!username) {
    toast.error("invalid or empty username");
    return;
  }

  if (roomID.length < 4) {
    toast.error("roomID should be 4 char long");
    return;
  }
};

const joinRoom = ({ roomID, username, socket }: { roomID: string; username: string | null; socket: Socket }) => {
  socket.emit("join-room", { username, roomID });
};
