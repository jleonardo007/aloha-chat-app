import { io } from "socket.io-client";
const url = "https://git.heroku.com/aloha-chat-ws-server.git";
const socket = io(url, { path: "/aloha-chat-ws-server.git" });

export default socket;
