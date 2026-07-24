"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        //@ts-ignore
        const parsedMesssage = JSON.parse(message);
        //console.log(parsedMesssage)
        if (parsedMesssage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMesssage.payload.roomId
            });
        }
        if (parsedMesssage.type === "chat") {
            const currentUserRoom = allSockets.find((x) => x.socket === socket)?.room;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i]?.room == currentUserRoom) {
                    allSockets[i]?.socket.send(parsedMesssage.payload.message);
                }
            }
        }
    });
});
//# sourceMappingURL=index.js.map