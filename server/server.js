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
		const registeredUser = { ...user, id: socket.id };

		socket.emit("user-connected", registeredUser);
		activeUsers.push(registeredUser);
		io.emit("get:active-users", activeUsers);
	});

	socket.on("get:active-users", () => {
		socket.emit("get:active-users", activeUsers);
	});

	socket.on("disconnect", () => {
		activeUsers.forEach((user, index, usersArray) => {
			if (user.id === socket.id) usersArray.splice(index, 1);
		});
		io.emit("get:active-users", activeUsers);
	});
});
