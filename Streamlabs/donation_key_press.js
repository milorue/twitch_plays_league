var robot = require('robotjs');
var request = require('request')
const secrets = require('../secrets')
var http = require('http');

robot.setMouseDelay(2);

var accountId = 'vvyyFhkaflMgM2SvPY6F_ilvtMpdzSkDxLdqE8oNV8u_CFLZHs6moFpb'

var riotId = '39wcWF7Thw8G7u6OUx7v-KK0GnltJNaneng9ogtDPRlvj-8'
var testId = 'IeHw33Na2SqNUWxk7u4Pm-aAY9bnEobFewsbr_gjw7Px45TT'



function getRandInt(max){
    return Math.floor(Math.random() * Math.floor(max))
}

var keys = ['q', 'w', 'e', 'r', 'd', 'f', '1', '2', '3', '4', '5', '6', 'b', 'a'] // these are my most commonly used league of legends key presses others may vary

function getRandomKey(keys){
    var numKeys = keys.length - 1; // -1 for indexing

    var keyIndex = getRandInt(numKeys);
    return keys[keyIndex] // returns the key press from the randomizer
}

function getKey(key){ // for specific donation for a specific key press
    for(var i in keys){
        if(key[i] === key){
            return key[i]
        }
    }

    return null
}

function fakeDonation(amount, message){ // unfinished using fallback for now

    request.post('https://streamlabs.com/api/v1.0/donations', {json: {
        name: 'DrunkenSkarl',
        message: message,
        identifier: 'milorue@gmail.com',
        amount: amount,
        currency: 'USD',
        access_token: secrets.access_token
    }}, (req, res, body) =>{
        console.log('Issued a Fake Donation with donationId: ' + body.donation_id)
    })
}

function isActive(summonerId){
    request('https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/' + summonerId + '?api_key=' + secrets.riotAPIKey, {json: true}, (req, res, body) =>{
        if(body.gameId !== undefined){

            console.log('Player is active in gameId: ' + body.gameId)
            robot.keyTap(getRandomKey(keys))
        }
        else{
            
            console.log('Player is not active')
            
        }
    })
}

var socketClient = require('websocket').client

var client = new socketClient();
client.on('connectFailed', (err) =>{
    console.log('Connection error: ' + err)
})
client.on('connect', (conn) =>{
    console.log('Connected')
    var once = false
    conn.on('message', (msg) =>{
        
        if(msg.utf8Data.includes('donation') && !once){
            console.log('New Donation')
            isActive(testId)
            once = true
        }
        else{
            // do nothing
        }
        
    })
})
client.connect('wss://sockets.streamlabs.com/socket.io/?token=' + secrets.socket_token + '&EIO=3&transport=websocket')



fakeDonation(10, 'Hello World!')

http.createServer((req, res) =>{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(req.url);
    res.end();
}).listen(8080)