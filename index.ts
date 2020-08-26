require('dotenv').config()
import express from 'express'
import axios from 'axios'
import robot from 'robotjs'
import {client} from 'websocket'

const app = express();
app.enable("trust proxy")

// const definitions
const api_url = "https://www.streamlabs.com/api/v1.0"
const keys = ['q','w','e','r','d','f']

// functions
const keyPress = (keys) => {
    if(keys !== undefined){
        var keyIndex = Math.floor(Math.random() * Math.floor(keys.length - 1))
        let keyToPress = keys[keyIndex]
        return keyToPress
    }
}

app.get("/", (_req, res) => {
        let auth_url = api_url + "/authorize?"

        let params = {
            'client_id': process.env.STREAM_LABS_APP_ID,
            'redirect_uri': "http://localhost:8080/auth",
            'response_type': 'code',
            'scope': 'donations.read+donations.create+socket.token',
        }

        auth_url += Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
        res.send(`
        <h1>Welcome to Twitch Plays League of Legends</h1>
        <h4>Written by Milo Rue</h4>
        <p>Version: 1.0.1</p>
        <a href="${auth_url}">👾🤖 Authorize Twitch Plays 🎮🎲 </a>
        <br>
        <br>
        <a href="/twitchplays">🎮 Start Playing</a>
        <br>
        <br>
        <a href="/donations">💸 View Donations </a>
        <br>
        <br>
        <a href="/socket">🔗 Check the Socket </a>
        `)
})

app.get("/donations", async (_req, res) => {
    const response = await axios.get(api_url + "/donations", 
    {
        params: {
            'access_token': process.env.STREAM_LABS_TOKEN
        }
        
    })
    res.send(`
    <table cellpadding="5">
    <tbody>
    <tr>
    <td><h4>donation id</h4></td>
    <td><h4>created at</h4></td>
    <td><h4>currency</h4></td>
    <td><h4>amount</h4></td>
    <td><h4>name</h4></td>
    <td><h4>message</h4></td>
    </tr>
    <tr>
    <td>${response.data.data[0].donation_id}</td>
    <td>${response.data.data[0].created_at}</td>
    <td>${response.data.data[0].currency}</td>
    <td>${response.data.data[0].amount}</td>
    <td>${response.data.data[0].name}</td>
    <td>${response.data.data[0].message}</td>
    </tr>
    <tr>
    <td>${response.data.data[1].donation_id}</td>
    <td>${response.data.data[1].created_at}</td>
    <td>${response.data.data[1].currency}</td>
    <td>${response.data.data[1].amount}</td>
    <td>${response.data.data[1].name}</td>
    <td>${response.data.data[1].message}</td>
    </tr>
    <tr>
    <td>${response.data.data[2].donation_id}</td>
    <td>${response.data.data[2].created_at}</td>
    <td>${response.data.data[2].currency}</td>
    <td>${response.data.data[2].amount}</td>
    <td>${response.data.data[2].name}</td>
    <td>${response.data.data[2].message}</td>
    </tr>
    <tr>
    <td>${response.data.data[2].donation_id}</td>
    <td>${response.data.data[2].created_at}</td>
    <td>${response.data.data[2].currency}</td>
    <td>${response.data.data[2].amount}</td>
    <td>${response.data.data[2].name}</td>
    <td>${response.data.data[2].message}</td>
    </tr>
    <tr>
    <td>${response.data.data[3].donation_id}</td>
    <td>${response.data.data[3].created_at}</td>
    <td>${response.data.data[3].currency}</td>
    <td>${response.data.data[3].amount}</td>
    <td>${response.data.data[3].name}</td>
    <td>${response.data.data[3].message}</td>
    </tr>
    <tr>
    <td>${response.data.data[4].donation_id}</td>
    <td>${response.data.data[4].created_at}</td>
    <td>${response.data.data[4].currency}</td>
    <td>${response.data.data[4].amount}</td>
    <td>${response.data.data[4].name}</td>
    <td>${response.data.data[4].message}</td>
    </tr>
    </tbody>
    </table>
    `)
})

app.get("/twitchplays", async (_req, _res) => {
    

    let webSocket = new client()
    _res.send("🖱 Playing... ⌨️")
    webSocket.on('connectFailed', (err) => {
        console.log("Experienced an error while connecting to stream labs web socket")
        console.log(err)
    })
    webSocket.on("connect", (conn) => {
        console.log("Successfully connected to stream labs web socket... playing now!")
        let once = false
        conn.on('message', (msg) => {
            if(msg.utf8Data.includes('donation') && !once){
                console.log("New donation!!!")
                let key = keyPress(keys)
                robot.keyTap(key)
                console.log("Pressed: " + key)
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
})

app.get("/auth", async (req, res) => {
    let code = req.query.code

    await axios.post(api_url + "/token?", 
    {
        'grant_type': 'authorization_code',
        'client_id': process.env.STREAM_LABS_APP_ID,
        'client_secret': process.env.STREAM_LABS_APP_SECRET,
        'redirect_uri': "http://localhost:8080/auth",
        'code': code
    })
    res.redirect('/')
})

app.get("/socket", async (_req, res) => {
    try{
        const response = await axios.get(api_url + "/socket/token", 
    {
        params: {
            'access_token': process.env.STREAM_LABS_TOKEN
        }
    })

    res.send(response.data)
    }
    catch(err){
        console.log(err)
    }
    
})

// spin up ports and open server
const port = process.env.PORT || 8080
app.listen(port, () => {
    console.info("👾🤖 Twitch Plays 🎲🎮 on " + port)
})