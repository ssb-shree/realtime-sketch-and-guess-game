export type RoomType = {
  id: string;
  players: string[];
  owner: string;
  guessWord: string;
  canvasState: any;
  status: "started" | "waiting";
};

export type Player = {
  id: string;
  username: string;
  score: number;
  inRoom: string;
};
