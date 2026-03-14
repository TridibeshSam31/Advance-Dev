import {WebSocketServer,WebSocket} from "ws"


const wss = new WebSocketServer({port:8080})

let userCount = 0 
let allSockets: WebSocket[] = [] // [socket1, socket2, socket3]

wss.on("connection",(socket)=>{
    allSockets.push(socket)

    userCount = userCount +1 
    console.log("New Connection Connected "+ userCount)


    socket.on("message",(message)=>{
        const text = message.toString()
        console.log("Received Mesaage:" + text)
        allSockets.forEach((element) => {
            element.send(text)
        })

    })
    

    socket.on("close",()=>{
        allSockets = allSockets.filter(s => s !== socket)
        userCount = userCount -1
        console.log("User Disconnected. Total Users: "+ userCount)
    })
})

//this is how a broadcasting connection works in websockets 
