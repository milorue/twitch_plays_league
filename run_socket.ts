require('dotenv').config()
import robot from 'robotjs'
import {client} from 'websocket'

const keys = ['q','w','e','r','d','f']

const keyPress = (keys) => {
    if(keys !== undefined){
        var keyIndex = Math.floor(Math.random() * Math.floor(keys.length - 1))
        let keyToPress = keys[keyIndex]
        return keyToPress
    }
}

let webSocket = new client()
console.log("🖱 Playing... ⌨️")
webSocket.on('connectFailed', (err) => {
    console.log("Experienced an error while connecting to stream labs web socket")
    console.log(err)
})
webSocket.on("connect", (conn) => {
    console.log("Successfully connected to stream labs web socket... playing now!")
    let once = false
    conn.on('message', (msg) => {
        console.log(msg)
        if(msg.utf8Data.includes('donation') && !once){
            console.log("New donation!!!")
            robot.keyTap(keyPress(keys))
            once = true
        }
        else{
            // do nothing
        }
    })

    conn.on('close', () =>{
        webSocket.connect('wss://sockets.streamlabs.com/socket.io/?token=' + process.env.STREAM_LABS_SOCKET_API_TOKEN + '&EIO=3&transport=websocket')
    })
})

webSocket.connect('wss://sockets.streamlabs.com/socket.io/?token=' + process.env.STREAM_LABS_SOCKET_API_TOKEN + '&EIO=3&transport=websocket')