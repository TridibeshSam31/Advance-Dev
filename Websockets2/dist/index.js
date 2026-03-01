"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let userCount = 0;
let allSockets = [];
wss.on("connection", (socket) => {
    allSockets.push(socket);
    userCount = userCount + 1;
    console.log("New Connection Connected " + userCount);
    socket.on("message", (message) => {
        const text = message.toString();
        console.log("Received Mesaage:" + text);
        allSockets.forEach((element) => {
            element.send(text);
        });
    });
    socket.on("close", () => {
        allSockets = allSockets.filter(s => s !== socket);
        userCount = userCount - 1;
        console.log("User Disconnected. Total Users: " + userCount);
    });
});
//# sourceMappingURL=index.js.map