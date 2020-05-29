const twitchPlay = require('./twitch_plays')

const username = 'Drunkenskarl'
const game = 'lol'

var  testPlay = new twitchPlay();

testPlay.createGameAccount(username, game)
var account = testPlay.getGameAccount(username, game)

testPlay.buildSLSocket(account.id, game) // builds the socket to run the bot