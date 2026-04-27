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
