"use client";
import Canvas from "@/components/game/Canvas";
import ChatBox from "@/components/game/ChatBox";
import PlayerList from "@/components/game/PlayerList";
import { useSocket } from "@/hooks/socket";

import { useRouter, useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";

import { useUserStore } from "@/store/user";
import { LineType } from "@/components/KonvaCanvas";

export type RoomType = {
  id: string;
  players: PlayerType[];
  owner: PlayerType;
  currentWord: string;
  guessedPlayers: Set<string>; // socket ID
  toTakeTurn: PlayerType[]; // socket ID's
  turnIndex: number;
  scores: Record<string, number>;
  canvasState: LineType[];
  status: "started" | "waiting" | "ended";
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

  const { setUsername } = useUserStore();

  const username = searchParams.get("username");

  // make a socket connection
  const socket = useSocket();

  const [roomState, setRoomState] = useState<RoomType>();

  useEffect(() => {
    if (!socket) return;

    setUsername(username || "");

    return () => {
      socket.emit("leave-room", { roomID });

      console.log("from page.tsx 1 ")
    };
  }, []);

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

    socket.on("game-error", ({ message }: { message: string }) => {
      toast.error(message);
      socket.emit("leave-room", "from on game error");
      router.push("/");
    });

    socket.on("room-deleted", () => {
      toast.error("Room got deletd");
      router.push("/");
    });

    return () => {
      socket.off("room-joined");
      socket.off("update-room-data");
      socket.off("user-left");

      socket.emit("leave-room", "from page.tsx 2nd use effect");

      console.log("from page.tsx 2 ")

    };
  }, [socket, roomID]);

  return (
    roomState && (
      <section className="min-h-screen md:h-screen w-screen flex flex-col md:flex-row justify-center items-center p-1">
        <PlayerList socket={socket} roomData={roomState} />
        <Canvas socket={socket} roomData={roomState} />
        <ChatBox socket={socket} roomData={roomState} />
      </section>
    )
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
