"use client";

import UserInfo from "@/components/root/UserInfo";
import RoomMenu from "@/components/root/RoomMenu";

import { useSocket } from "@/hooks/socket";
import { useEffect } from "react";

const Rootpage = () => {
  const socket = useSocket();

  return (
    <section className="h-screen p-1 gap-1 w-screen overflow-x-hidden flex flex-col md:flex-row items-center justify-center">
      <UserInfo socket={socket} />
      <RoomMenu socket={socket} />
    </section>
  );
};

export default Rootpage;
