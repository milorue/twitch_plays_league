var robot = require('robotjs');
var request = require('sync-request')
require('dotenv').config()



class TwitchPlays{
    constructor(){
        this.gameAccounts = [], // league username
        this.lolKeys = ['q','w','e','r','d','f'], // can add more through custom keys
        this.customKeyset = null
    }

    // creates a game account by querying that games api or service for all info about your account
    // allows for expansion of software into other games
    // supported games: (LoL) *add more when supported

    getGameAccount(username, game){
        for(var i in this.gameAccounts){
            if(this.gameAccounts[i].username === username && this.gameAccounts[i].game === game){
                return this.gameAccounts[i]
            }
        }

        return(this.gameAccounts.find({username: username}))
    }

    createGameAccount(username, game){
        if(game === 'lol'){
            var response = request(
                'GET',
                'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+username+ '?api_key=' + process.env.RIOT_API_KEY)
                
                var data = JSON.parse(response.getBody()) 
                var account = {
                    game: game,
                    username: username,
                    id: data.id,
                    accountId: data.accountId,
                    puuid: data.puuid,
                    level: data.summonerLevel
                }

                this.gameAccounts.push(account) // adds account to our list of game accounts
                return account
        }
        else{
            return null
        }
    }

    // removes a game account
    // looks for the account in our array and removes it *super simple

    deleteGameAccount(username, game){
        for(var i in this.gameAccounts){
            if(this.gameAccounts[i].username === username && this.gameAccounts[i].game === game){
                this.gameAccounts.splice(i, 1) // removes that account from the obj
            }
        }
    }

    // helper function for generating a random integer

    getRandInt(max){
        return Math.floor(Math.random() * Math.floor(max))
    }

    // returns a random key name from an array of set keys
    // can pass it a list of keys

    randomKeypress(game, keys){
        if(keys !== undefined){ // custom key set is being used
            // disregard game for custom sets
            var keyIndex = this.getRandInt((keys.length -1))
            return keys[keyIndex]

        }else{ // use default
            
            if(game === 'lol'){
                var keyIndex = this.getRandInt(this.lolKeys.length - 1)
                return this.lolKeys[keyIndex]
            }
            else{
                // do nothing
            }
        }
    }

    // a single key press

    keyPress(keyToPress, keys){
        var keyIndex = keys.findIndex(keyToPress)
        if(keyIndex !== -1){
            return keys[keyIndex]
        }else{
            return null
        }
    }

    // simulates a donation event and sends a post request with a new donation 
    // *can be done in streamlabs dashboard as well

    simulateDonation(user, email, amount, message){
        request.post('https://streamlabs.com/api/v1.0/donations', {json: {
        name: user,
        message: message,
        identifier: email,
        amount: amount,
        currency: 'USD',
        access_token: process.env.STREAMLABS_ACCESS_TOKEN
    }}, (req, res, body) =>{
    })
    }

    // returns all donations for the authorized access_token

    getDonations(){
        var response = request(
            'GET',
            'https://streamlabs.com/api/v1.0/donations?access_token=' + process.env.STREAMLABS_ACCESS_TOKEN,
        )
    
        var data = JSON.parse(response.getBody())
        if(data.data !== undefined){
            return data.data // the array is in data field of returned json obj
        }else{
            return null
        }
        
    }

    getLatestDonation(){
        var response = request(
            'GET',
            'https://streamlabs.com/api/v1.0/donations?access_token=' + process.env.STREAMLABS_ACCESS_TOKEN
        )

        var data = JSON.parse(response.getBody())
        if(data.data[0] !== undefined){
            return data.data[0]
        }else{
            return null
        }
    }

    // checks spectator api for if player specified is in an active game or not

    isPlayerActive(summonerId, game){

        if(game === 'lol'){
            var response = request(
                'GET',
                'https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/' + summonerId + '?api_key=' + process.env.RIOT_API_KEY
            )

            if(response.statusCode === 404){ // for inactive player
                return false
            }

            var data = JSON.parse(response.getBody())
            if( data.gameId !== undefined){
                return true // player is in an active game (practice tool doesnt count as active apparently)
            }
            else{
                return false
            }
        }
    }

    // builds the socket to watch StreamLabs API for new donations and other things

    buildSLSocket(summonerId, game){
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
                    this.runKeypress(summonerId, game)
                    once = true
                }
                else{
                    // do nothing
                }
                
            })

            conn.on('close', () =>{
                client.connect('wss://sockets.streamlabs.com/socket.io/?token=' + process.env.SOCKET_TOKEN + '&EIO=3&transport=websocket')
            })
                
        })
        client.connect('wss://sockets.streamlabs.com/socket.io/?token=' + process.env.SOCKET_TOKEN + '&EIO=3&transport=websocket')
    }

    // requires summoner id which is in your  game account obj

    runKeypress(summonerId, game){
        if(this.isPlayerActive(summonerId, game)){
            console.log('Player is active')
            console.log(this.getLatestDonation())
            var keyPress = this.randomKeypress('lol') // use default keys for now
            console.log(keyPress)
            robot.keyTap(keyPress)
        }else{
            console.log('Player is not active')
            console.log(this.getLatestDonation())
        }

        // console.logs are placeholder for now
    }
   
}


module.exports = TwitchPlays