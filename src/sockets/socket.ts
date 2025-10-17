import { Server } from "socket.io";

import http from "http";

let io: Server;

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("Client connected: ", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
