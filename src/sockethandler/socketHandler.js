import { User } from "../models/User.js";

export const socketHandler = (io) => {
  let onlineUsers = [];

  io.on("connection", (socket) => {
    socket.on("set-user", (newUser) => {
      if (!onlineUsers.some((user) => user.user.uuid === newUser.uuid)) {
        onlineUsers.push({ user: newUser, socketId: socket.id });
      }
      // console.log("socketId ", socket.id);
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

    //game invitation
    socket.on("invite:user", (inviter, invitedUserId) => {
      const invitedSocket = onlineUsers.find(
        (user) => user.user.uuid === invitedUserId
      );

      if (invitedSocket) {
        io.to(invitedSocket?.socketId).emit("game:invitation", inviter);
      }
    });

    // game decline
    socket.on("invite:decline", (decliner, inviterUser) => {
      const inviterSocket = onlineUsers.find(
        (user) => user.user.uuid === inviterUser
      );

      if (inviterSocket) {
        io.to(inviterSocket?.socketId).emit("game:decline", decliner);
      }
    });

    //game accept
    socket.on("invite:accept", (inviter, invitedUser) => {
      const inviterSocket = onlineUsers.find(
        (user) => user.user.uuid === inviter.uuid
      );

      if (inviterSocket) {
        io.to(inviterSocket?.socketId).emit("game:start", invitedUser);
      }
    });
  });
};
