import {WebSocketServer} from "ws"


const wss = new WebSocketServer({port:8080})

let userCount = 0 

wss.on("connection",(socket)=>{
    userCount = userCount +1 
    console.log("New Connection Connected "+ userCount)


    socket.on("message",(message)=>{
        const text = message.toString()
        console.log("Received Mesaage:" + text)

    })

})

//socket here is just an instance/naming , its not Socket.io library 

