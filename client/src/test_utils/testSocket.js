const EventEmitter = require("events");
const emitterForTestWebSocket = new EventEmitter();

/*
   emitterForTestWebSocket instance performs socket.io like behavior 
   for a test enviroment 
*/
module.exports = emitterForTestWebSocket;
