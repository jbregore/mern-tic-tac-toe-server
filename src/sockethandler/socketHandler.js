import { Game } from "../models/Game.js";
import { User } from "../models/User.js";

export const socketHandler = (io) => {
  let onlineUsers = [];
  let game = {
    players: [],
    agreedPlayers: [],
    agreedPlayersCount: 0,
  };

  io.on("connection", (socket) => {
    socket.on("set-user", (newUser) => {
      if (!onlineUsers.some((user) => user.user.uuid === newUser.uuid)) {
        onlineUsers.push({ user: newUser, socketId: socket.id });
        game.players.push(newUser.uuid);
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

    //game invitation
    socket.on("invite:user", (inviter, invitedUserId) => {
      const invitedSocket = onlineUsers.find(
        (user) => user.user.uuid === invitedUserId
      );

      if (invitedSocket) {
        io.to(invitedSocket?.socketId).emit("game:invitation", inviter);
      }
    });

    // game invite cancelled
    socket.on("invite:cancel", (invitedUser) => {
      const inviterSocket = onlineUsers.find(
        (user) => user.user.uuid === invitedUser.uuid
      );

      if (inviterSocket) {
        io.to(inviterSocket?.socketId).emit("game:close");
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

    //gameplay
    socket.on("gameplay", (turn, me, opponent, boardData) => {
      const opponentSocket = onlineUsers.find(
        (user) => user.user.uuid === opponent.uuid
      );

      if (opponentSocket) {
        io.to(opponentSocket?.socketId).emit(
          "gameplay:updated",
          turn,
          me,
          opponent,
          boardData
        );
      }
    });

    socket.on("gameplay:finished", async (hasWinner, winner, loser) => {
      if (hasWinner) {
        const winnerSocket = onlineUsers.find(
          (user) => user.user.uuid === winner.uuid
        );

        io.to(winnerSocket?.socketId).emit(
          "gameplay:done",
          "Congratulations you won.",
          true
        );

        const loserSocket = onlineUsers.find(
          (user) => user.user.uuid === loser.uuid
        );

        io.to(loserSocket?.socketId).emit("gameplay:done", "You lose.", false);
      } else {
        const winnerSocket = onlineUsers.find(
          (user) => user.user.uuid === winner.uuid
        );

        io.to(winnerSocket?.socketId).emit(
          "gameplay:done",
          "It's a draw! The game ends in a tie."
        );

        const loserSocket = onlineUsers.find(
          (user) => user.user.uuid === loser.uuid
        );

        io.to(loserSocket?.socketId).emit(
          "gameplay:done",
          "It's a draw! The game ends in a tie."
        );
      }
    });

    socket.on("continue:agreed", (user, opponent, isContinue) => {
      const userSocket = onlineUsers.find((u) => u.user.uuid === user.uuid);

      const opponentSocket = onlineUsers.find(
        (u) => u.user.uuid === opponent.uuid
      );

      if (isContinue) {
        game.agreedPlayers.push(user);
      }

      game.agreedPlayersCount++;

      const allPlayersInGameAgreed = checkPlayersAgreed(
        game.players,
        game.agreedPlayers
      );

      if (!isContinue && !allPlayersInGameAgreed) {
        io.to(userSocket?.socketId).emit("cancel:new_match");
        io.to(opponentSocket?.socketId).emit("cancel:new_match", user);
        game.agreedPlayers = [];
        game.agreedPlayersCount = 0;
      }

      if (allPlayersInGameAgreed) {
        io.to(userSocket?.socketId).emit("start:new_match");
        io.to(opponentSocket?.socketId).emit("start:new_match");

        game.agreedPlayers = [];
        game.agreedPlayersCount = 0;
      } else if (!allPlayersInGameAgreed && game.agreedPlayersCount == 2) {
        io.to(userSocket?.socketId).emit("cancel:new_match");
        io.to(opponentSocket?.socketId).emit("cancel:new_match", user);
        game.agreedPlayers = [];
        game.agreedPlayersCount = 0;
      } else {
      }
    });
  });
};

const checkPlayersAgreed = (playersInGameUUIDs, playersWhoAgreed) => {
  const allPlayersInGame =
    playersWhoAgreed.every((player) =>
      playersInGameUUIDs.includes(player.uuid)
    ) && playersWhoAgreed.length === 2;

  return allPlayersInGame;
};
