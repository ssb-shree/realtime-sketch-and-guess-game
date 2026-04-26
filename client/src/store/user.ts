import { create } from "zustand";

type UserStore = {
  username: string;
  roomID: string;
  setUsername: (username: string) => void;
  setRoomID: (roomID: string) => void;
};

export const useUserStore = create<UserStore>()((set) => ({
  username: "",
  roomID: "",
  setUsername: (username) => set((p) => ({ ...p, username })),
  setRoomID: (roomID) => set((p) => ({ ...p, roomID })),
}));
