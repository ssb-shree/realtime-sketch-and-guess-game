"use client";

import { Socket } from "socket.io-client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";

type roomDataType = { id: string; status: "started" | "waiting" };

const RoomMenu = ({ socket }: { socket: Socket | null }) => {
  const [roomList, setRoomData] = useState<roomDataType[]>([]);

  const { username, roomID, setRoomID } = useUserStore();

  const router = useRouter();

  useEffect(() => {
    // incase there is no socket connection provided dont emit or liste to events
    if (!socket) return;

    // get the room data and status
    socket.emit("get-active-room-data");

    // listen for room data updates and status
    socket.on("update-active-room-data", ({ roomData }: { roomData: roomDataType[] }) => setRoomData(roomData));

    return () => {
      socket.off("update-active-room-data");
    };
  }, [socket]);

  const handleJoinGame = (id: string) => {
    // get the username
    if (!username) {
      toast.error("empty username is not allowed");
      return;
    }

    // send the user to join the game
    router.push(`/game/${id}?username=${username}`);
  };

  return (
    <div className="h-full w-full md:w-[70%] flex flex-col justify-start items-start p-2 ">
      <div className="mt-4 h-full w-full">
        <span className="capitalize">Active Rooms</span>
        <div className="h-full w-full flex flex-col justify-start items-center gap-y-2 rounded-2xl">
          {roomList &&
            roomList.map((room) => (
              <div
                onClick={() => handleJoinGame(room.id)}
                key={room.id}
                className="cursor-pointer btn btn-outline border-2 w-full p-2 flex flex-row justify-between items-center rounded-2xl"
              >
                <span>{room.id}</span>
                <span className="border-l-2 p-1">{room.status}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RoomMenu;
