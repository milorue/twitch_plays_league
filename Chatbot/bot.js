const tmi = require('tmi.js');

// Define configuration options
const opts = {
  identity: {
    username: "ChatPlaysTwitch",
    password: "oauth:"
  },
  channels: [
    "michaelscarn000"
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  }
  else if(commandName == "!pressQ"){
    client.say(target, `You wasted ${opts.channels[0]}'s Q Ability!`);
    console.log(`* Executed ${commandName} command`);
  }
  else if(commandName == "!pressW"){
    client.say(target, `You wasted ${opts.channels[0]}'s W Ability!`);
    console.log(`* Executed ${commandName} command`);
  } 
  else if(commandName == "!pressE"){
    client.say(target, `You wasted ${opts.channels[0]}'s E Ability!`);
    console.log(`* Executed ${commandName} command`);
  } 
  else if(commandName == "!pressR"){
    client.say(target, `You wasted ${opts.channels[0]}'s R Ability!`);
    console.log(`* Executed ${commandName} command`);
  } 
  else if(commandName == "!pressD"){
    client.say(target, `You wasted ${opts.channels[0]}'s D Ability!`);
    console.log(`* Executed ${commandName} command`);
  }
  else if(commandName == "!pressF"){
    client.say(target, `You wasted ${opts.channels[0]}'s F Ability!`);
    console.log(`* Executed ${commandName} command`);
  }
  else if(commandName == "!help"){
    client.say(target, `!pressQ, !pressW, !pressE, !pressR, !pressD, !pressF`);
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}