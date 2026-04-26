"use client";

import { Socket } from "socket.io-client";

import { useEffect } from "react";

const RoomMenu = ({ socket }: { socket: Socket | null }) => {
  useEffect(() => {
    // incase there is no socket connection provided dont emit or liste to events
    if (!socket) return;

    // get the room data and status
    socket.emit("get-active-room-data", (payload: any) => console.log(payload));

    // listen for room data updates and status
    socket.on("update-active-room-data", (payload: any) => console.log(payload));

    return () => {
      // when this component unmounts close the socket connection
      if (socket) {
        socket.off("update-active-room-data");
        socket.close();
      }
    };
  }, [socket]);
  return (
    <div className="h-full w-full md:w-[70%] flex flex-col justify-start items-start p-2 ">
      <div className="mt-4 h-full w-full">
        <span className="capitalize">Active Rooms</span>
        <div className="h-full w-full flex flex-col justify-start items-center gap-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-2 w-full p-2 flex flex-row justify-between items-center rounded-2xl">
              <span>RoomID</span>
              <span className="border-l-2 p-1">Status</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomMenu;
