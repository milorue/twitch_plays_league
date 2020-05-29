var robot = require('robotjs');
var request = require('request')
const secrets = require('./secrets')
var http = require('http');

robot.setMouseDelay(2);

var accountId = '' // replace with your own account id (thru riotapi)
var riotId = '' // replace with own summonerId (thru riotapi)

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
        name: 'Test', 
        message: message,
        identifier: 'ATest',
        amount: amount,
        currency: 'USD',
        access_token: secrets.access_token
    }}, (req, res, body) =>{
        console.log('Issued a Fake Donation with donationId: ' + body.donation_id)
    })
}

function getDonations(callback){
    request('https://streamlabs.com/api/v1.0/donations?access_token=' + secrets.access_token, {json: true}, (err, res, body) =>{
        if(err || res.statusCode !== 200){
            return callback(err || {statusCode: response.statusCode})
        }
        callback(null, body.data)
    })
}

function getLatestDonation(callback){
    request('https://streamlabs.com/api/v1.0/donations?access_token=' + secrets.access_token, {json: true}, (err, res, body) =>{
        if(err || res.statusCode !== 200){
            return callback(err || {statusCode: response.statusCode})
        }

        if(body.data[0] !== undefined){
            callback(null, body.data[0])
        }else{
            callback(null, [])
        }
        
    })
}



function pressKey(summonerId){
    request('https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/' + summonerId + '?api_key=' + secrets.riotAPIKey, {json: true}, (req, res, body) =>{
        if(body.gameId !== undefined){

            console.log('Player is active in gameId: ' + body.gameId)

            getLatestDonation(function(err, body){
                if(err){
                    console.log(err)
                }else{
                    console.log(body)
                }
            })

            robot.keyTap(getRandomKey(keys))
        }
        else{
            
            console.log('Player is not active')
            getLatestDonation(function(err, body){ // prints the donation still
                if(err){
                    console.log(err)
                }else{
                    console.log(body)
                }
            })
            
        }
    })
}

function buildSLSocket(){
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
                pressKey(testId)
                once = true
            }
            else{
                // do nothing
            }
            
        })
    })
    client.connect('wss://sockets.streamlabs.com/socket.io/?token=' + secrets.socket_token + '&EIO=3&transport=websocket')
}

// fakeDonation(10, 'Hello World!')
buildSLSocket() // build the web socket to watch streamlabs api

// get donations


http.createServer((req, res) =>{ // builds a little http server to pressKey off of
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Donation Server')
    res.end();
}).listen(8000)