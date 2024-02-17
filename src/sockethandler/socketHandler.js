import { User } from "../models/User.js";

export const socketHandler = (io) => {
  let onlineUsers = [];

  io.on("connection", (socket) => {
    socket.on("set-user", (newUser) => {
      if (!onlineUsers.some((user) => user.user.uuid === newUser.uuid)) {
        onlineUsers.push({ user: newUser, socketId: socket.id });
      }
      io.emit("get-users", onlineUsers);
    });

    socket.on("logout", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("get-users", onlineUsers);
    });

    socket.on("offline", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("get-users", onlineUsers);
    });
  });
};
