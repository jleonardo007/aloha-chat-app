const options = {
   path: "/",
   cors: {
      origin: "http://localhost:3000",
   },
};
const PORT = process.env.PORT || 4000;
const io = require("socket.io")(PORT, options);

let activeUsers = [];

io.on("connection", (socket) => {
   socket.on("new-user", (user) => {
      const registeredUser = { id: socket.id, ...user };

      activeUsers.push(registeredUser);
      io.emit("active-users", activeUsers);
   });

   socket.on("disconnect", () => {
      activeUsers.forEach((user, index, usersArray) => {
         if (user.id === socket.id) usersArray.splice(index, 1);
      });
      io.emit("active-users", activeUsers);
   });
});
