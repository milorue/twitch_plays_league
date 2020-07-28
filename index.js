const twitchPlay = require('./twitch_plays')
require('dotenv').config()

const username = 'DrunkenSkarl'
const game = 'lol'

var  testPlay = new twitchPlay();

testPlay.createGameAccount(username, game)
var account = testPlay.getGameAccount(username, game)

testPlay.buildSLSocket(account.id, game) // builds the socket to run the bot