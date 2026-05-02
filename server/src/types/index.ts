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
  turnTimer?: NodeJS.Timeout;
};

export type PlayerType = {
  id: string;
  username: string;
  score: number;
};

export type LineType = {
  points: number[];
  color: string;
  width: number;
};
