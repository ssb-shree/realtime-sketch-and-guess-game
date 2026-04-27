import { Server } from "socket.io";

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

const rooms = new Map<string, RoomType>();

io.on("connection", (socket) => {
  // log newly joined sockets
  logger.info(`${socket.id} joined the server`);

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
      io.to(roomId).emit("user-left", {roomData : room});
      handled = true;
    });
  });

  socket.on("join-room", ({ roomID, username }: { roomID: string; username: string }) => {
    // check if provided payload is valid
    if (roomID.length < 4 || !username) {
      return socket.emit("game-error", { message: "invalid payload was provided while joining a room" });
    }

    // get the room exist
    const roomExist = rooms.get(roomID);

    // create a new Player
    const newPlayer: PlayerType = { id: socket.id, username, inRoom: roomID, score: 0 };

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
      guessWord: "plaeholder-for-now",
      owner: newPlayer,
      players: [newPlayer],
      status: "waiting",
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

  socket.on("get-active-room-data", () => {
    console.log("event firedd");
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
});
