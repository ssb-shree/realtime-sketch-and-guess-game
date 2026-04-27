"use client";

import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";

const UserInfo = ({ socket }: { socket: Socket | null }) => {
  const { roomID, setRoomID, username, setUsername } = useUserStore();

  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string>();

  const handleCreateRoom = () => {
    if (!socket) {
      setErrorMessage("socket connection failed");
      toast.error("socket connection failed - userinfo");
      return;
    }

    // check for empty values
    if (roomID.length < 4) {
      setErrorMessage("roomID must be 4 char long");
      toast.error("roomID must be 4 char long");
      return;
    }

    if (username.length === 0) {
      setErrorMessage("username cant be empty");
      toast.error("username cant be empty");
      return;
    }

    // check is roomID is taken
    socket.emit("check-roomID-taken", { roomID });

    socket.once("is-roomID-taken", ({ taken }: { taken: boolean }) => {
      if (taken) {
        toast.error("roomID is already in use by other players");
        return;
      }

      router.push(`/game/${roomID}?username=${username}`);
    });
  };

  return (
    <div className="md:w-[30%] border-2 rounded-3xl p-6 flex flex-col space-y-8 mt-10 md:mt-0">
      {/* Hero Text */}
      <div className="text-center space-y-2 bg-base-200 rounded-xl p-3">
        <h1 className="text-2xl font-semibold">Draw like a genius.</h1>
        <p className="text-zinc-500">Or don't. Just make them guess.</p>
      </div>

      {/* Form */}
      <form className="w-full flex flex-col space-y-3">
        {/* Username */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="username" className="text-sm">
            Name Yourself
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Here Bredrin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input w-full"
          />
        </div>

        {/* Room ID */}
        <div className="flex flex-col space-y-1">
          <label htmlFor="roomId">Create a Room ID</label>
          <input
            type="text"
            name="roomId"
            id="roomId"
            className="input w-full"
            placeholder="shreeB"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
          />
        </div>

        {/* Error Message  */}
        {errorMessage && <span className="text-xs text-error text-center">{errorMessage}</span>}

        {/* Submit */}
        <button onClick={handleCreateRoom} type="button" className="btn bg-base-100">
          Start Game
        </button>
      </form>
    </div>
  );
};

export default UserInfo;
