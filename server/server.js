const options = {
  path: "/",
  cors: {
    origin: "https://aloha-chat-app-fc64f.web.app",
  },
};
const PORT = process.env.PORT || 4000;
const io = require("socket.io")(PORT, options);

let activeUsers = [];
let usersConversationsVolatileStorage = [];

function handleUserConversations(user, friendId, storedMessages, hasDeletedMessages) {
  const conversation = user.conversations.find(
    (conversation) => conversation.friendId === friendId
  );

  if (hasDeletedMessages && storedMessages) conversation.messages = [...storedMessages];
  else if (conversation) conversation.messages.push(...storedMessages);
  else
    user.conversations.push({
      friendId,
      messages: [...storedMessages],
    });
}

function getCoversation(conversations, friendId) {
  const conversation = conversations.find((conversation) => conversation.friendId === friendId);

  if (conversation) return conversation.messages;
  else return [];
}

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

  socket.on("change-profile", (updatedUser) => {
    activeUsers.forEach((user, index, usersArray) => {
      if (user.id === updatedUser.id) usersArray[index] = { ...updatedUser };
    });
    io.emit("get:active-users", activeUsers);
  });

  socket.on("friend-actions", ({ user, friend, action }) => {
    socket.to(friend.id).emit("friend-actions", { friendId: user.id, action });
  });

  socket.on("seen-message", ({ id }) => {
    socket.to(id).emit("seen-message");
  });

  socket.on("sent-message", ({ friend, message }) => {
    socket.to(friend.id).emit("new-message", message);
    socket.to(friend.id).emit("new-messages-counter", message.from);
  });

  socket.on("save-conversation", ({ userId, friendId, messages, hasDeletedMessages }) => {
    const user = usersConversationsVolatileStorage.find((user) => user.userId === userId);
    const storedMessages = messages.map((message) => {
      return { ...message, isStored: true };
    });

    if (user) handleUserConversations(user, friendId, storedMessages, hasDeletedMessages);
    else
      usersConversationsVolatileStorage.push({
        userId,
        conversations: [{ friendId, messages: [...storedMessages] }],
      });
  });

  socket.on("get:conversation", ({ userId, friendId }) => {
    const userConversations = usersConversationsVolatileStorage.find(
      (userConversations) => userConversations.userId === userId
    );
    let results = null;

    if (userConversations) results = getCoversation(userConversations.conversations, friendId);
    else results = [];

    socket.emit("get:conversation", results);
  });

  socket.on("disconnect", () => {
    activeUsers.forEach((user, index, usersArray) => {
      if (user.id === socket.id) usersArray.splice(index, 1);
    });

    usersConversationsVolatileStorage.forEach((user, index, usersArray) => {
      if (user.id === socket.id) usersArray.splice(index, 1);
    });

    io.emit("get:active-users", activeUsers);
  });
});
