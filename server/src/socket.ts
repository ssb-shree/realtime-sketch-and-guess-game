import { Server, Socket } from "socket.io";

import http from "http";

import app from "./app";
import logger from "./utils/logger";

export const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.STATUS !== "DEV" ? process.env.CLIENT_URL : "http://localhost:3000",
    credentials: true,
  },
});

import type { PlayerType, RoomType } from "./types";
import { getWord, shuffle } from "./utils/helper";

const rooms = new Map<string, RoomType>();

io.on("connection", (socket) => {
  // log newly joined sockets
  logger.info(`${socket.id} joined the server`);

  // connection logic
  socket.on("join-room", ({ roomID, username }: { roomID: string; username: string }) => {
    // check if provided payload is valid
    if (roomID.length < 4 || !username) {
      return socket.emit("game-error", { message: "invalid payload was provided while joining a room" });
    }

    // get the room exist
    const roomExist = rooms.get(roomID);

    // create a new Player
    const newPlayer: PlayerType = { id: socket.id, username, score: 0 };

    // if room exist what is the status of that room
    if (roomExist) {
      // prevent users from joining a game which has begun
      if (roomExist.status === "started") {
        return socket.emit("game-error", { message: "cannot join the game which has already started" });
      }

      //check if player is already there
      const alreadyExists = roomExist.players.find((p) => p.id === socket.id);
      if (alreadyExists) {
        return socket.emit("game-error", { message: `already joined rooom ${roomExist.id}` });
      }

      // check if a player with same username is already in room
      const usernameTaken = roomExist.players.find((p) => p.username === username);
      if (usernameTaken) {
        return socket.emit("game-error", { message: "player with same username is already in room" });
      }

      // if not add the new player to the room
      roomExist.players.push(newPlayer);
      socket.join(roomExist.id);

      // send user a confirmation
      socket.emit("room-joined", { roomData: roomExist });

      //emit to everyone in the room that someone has joined
      io.to(roomExist.id).emit(`update-room-data`, roomExist);

      logger.info(`${username} joined the room ${roomExist.id}`);
      return;
    }

    logger.warn(`user tried to access a non-exisiting room with id ${roomID}, creating a new one`);

    // if room does not exist, create the room with provided roomID

    const newRoomData: RoomType = {
      canvasState: [],
      id: roomID,
      currentWord: "plaeholder-for-now",
      owner: newPlayer,
      players: [newPlayer],
      status: "waiting",
      guessedPlayers: new Set<string>(),
      turnIndex: 0,
      toTakeTurn: [],
      scores: {},
    };
    rooms.set(roomID, newRoomData);

    // let the socket join the room
    socket.join(roomID);

    //emit to everyone in the room that someone has joined
    io.to(newRoomData.id).emit(`update-room-data`, newRoomData);

    // send user a confirmation
    socket.emit("room-joined", { roomData: newRoomData });

    logger.info(`${username} joined ${roomID}`);
  });

  // disconnection logic
  socket.on("leave-room", () => {
    logger.info(`${socket.id} left the server`);
    let handled = false;

    rooms.forEach((room, roomId) => {
      if (handled) return;

      const exists = room.players.some((p) => p.id === socket.id);

      if (!exists) return;

      // host left delete room
      if (room.owner.id === socket.id) {
        io.to(roomId).emit("room-deleted");
        rooms.delete(roomId);
        handled = true;
        return;
      }

      // if normal user remove from room
      room.players = room.players.filter((p) => p.id !== socket.id);
      io.to(roomId).emit("user-left", { roomData: room });
      handled = true;
    });
  });

  socket.on("get-active-room-data", () => {
    const roomData = Array.from(rooms.values()).map(({ id, status }) => ({
      id,
      status,
    }));
    socket.emit("update-active-room-data", { roomData: roomData });
  });

  socket.on("check-roomID-taken", ({ roomID }: { roomID: string }) => {
    const roomExist = rooms.has(roomID);
    socket.emit("is-roomID-taken", { taken: roomExist });
  });

  // ─── called once everyone's had their turn (or players rage-quit below min) ───
  function endGame(io: Server, room: RoomType) {
    room.status = "ended";

    // kill any running turn timer so it doesn't fire AFTER the game ends
    // (yes, that bug is as fun as it sounds)
    clearTimeout(room.turnTimer);

    io.to(room.id).emit("game-ended", { scores: room.scores });

    // boot everyone from the socket room, then delete from memory
    io.in(room.id).socketsLeave(room.id);
    rooms.delete(room.id);
  }

  const BREAK_TIME = 5_000; // 5 seconds of "here's who's winning, cope"

  function startBreak(io: Server, room: RoomType, word : string) {
    io.to(room.id).emit("show-scores", {
      word,
      scores: room.scores,
      nextDrawer: room.toTakeTurn[room.turnIndex + 1]?.username ?? null, // null = last turn, game ending
    });

    setTimeout(() => {
      room.turnIndex++;
      nextTurn(io, room);
    }, BREAK_TIME);
  }

  // ─── the heart of the game loop — called at the start of every turn ───
  function nextTurn(io: Server, room: RoomType) {
    const TURN_TIME = 60_000; // 60 seconds per turn

    // base case: everyone in toTakeTurn has drawn → wrap up
    if (room.turnIndex >= room.toTakeTurn.length) {
      endGame(io, room);
      return;
    }

    // who's drawing this turn (turnIndex walks forward each turn)
    const drawer = room.toTakeTurn[room.turnIndex];

    const word = getWord();

    room.currentWord = word;
    room.guessedPlayers = new Set(); // fresh slate — last turn's guessers don't carry over

    // only the drawer gets the actual word
    // everyone else just knows WHO is drawing
    io.to(drawer!.id).emit("your-turn", { word });
    io.to(room.id).except(drawer!.id).emit("turn-started", {
      drawer: drawer!.username,
      turnIndex: room.turnIndex,
      totalTurns: room.toTakeTurn.length,
    });

    // the turn's "natural death" — fires if time runs out before everyone guesses
    // if everyone guesses early, this gets clearTimeout'd and we skip straight to next turn
    room.turnTimer = setTimeout(() => {
      // reveal the word to everyone who failed (yes, shame them)
      io.to(room.id).emit("turn-ended", { word, scores: room.scores });

      room.turnIndex++;
      startBreak(io, room, word);
    }, TURN_TIME);
  }

  // ─── triggered by whoever clicks "Start Game" in the lobby ───
  socket.on("start-game", ({ roomID }: { roomID: string }) => {
    const room = rooms.get(roomID);
    if (!room) return socket.emit("game-error", { message: "Invalid roomID" });
    if (room.players.length < 3) return; // not enough humans to embarrass themselves

    room.status = "started";

    // shuffle so the drawing order isn't just "whoever joined first"
    room.toTakeTurn = shuffle(room.players);
    room.turnIndex = 0; // start at the first shuffled player
    room.scores = {} as Record<string, number>;
    room.guessedPlayers = new Set();

    // everyone starts at 0 — a blank canvas of mediocrity
    room.players.forEach((p) => (room.scores[p.id] = 0));

    nextTurn(io, room); // kick off turn 0
  });
});
