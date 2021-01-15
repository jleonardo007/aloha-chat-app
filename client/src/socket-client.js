import { io } from "socket.io-client";
const url = process.env.NODE_ENV === "test" ? "" : "http://localhost:4000";
const socket = io(url, { path: "/" });

export default socket;
