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

io.on("connection", (socket) => {
  // log newly joined sockets
  logger.info(`${socket.id} joined the server`);

  // disconnection logic
  socket.on("disconnect", () => {
    logger.info(`${socket.id} left the server`);
  });
});
