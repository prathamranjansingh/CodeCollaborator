const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const PORT = 5000;
const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  //   console.log(`User connected: ${socket.id}`);
  socket.on("join", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on("code_change", ({ roomId, code }) => {
    socket.in(roomId).emit("code_change", { code });
  });
  //jo users bad mein aaye usko vo likha hua code mile
  socket.on("sync-code", ({ socketId, code }) => {
    io.to(socketId).emit("code_change", { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    // leave all the room
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

server.listen(PORT, () => {
  console.log("Server is running on the port ", PORT);
});
