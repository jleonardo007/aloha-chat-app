import { io } from "socket.io-client";
const url = "https://aloha-chat-ws-server.herokuapp.com/";
const socket = io(url, { path: "/" });

export default socket;
