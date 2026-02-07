
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const client = new Client({
  intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials:[Partials.Channel]
});

client.commands = new Collection();

for(const file of fs.readdirSync('./commands')){
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
}

const eco = require('./modules/economy');
const ent = require('./modules/entreprise');
const ui  = require('./modules/ui');
const erlc = require('./modules/erlc');

client.once('ready', ()=>{
  console.log('SYSTEM FINAL LANCÉ');
  eco.payday(client);
  erlc.sync(client);
});

client.on('interactionCreate', async i=>{

  if(i.isChatInputCommand()){
    const c = client.commands.get(i.commandName);
    if(c) c.execute(i, client);
  }

  if(i.isButton()){
    eco.buttons(i,client);
    ent.buttons(i,client);
    ui.buttons(i,client);
  }

  if(i.isStringSelectMenu()){
    eco.menus(i,client);
    ent.menus(i,client);
  }

});

client.login(config.token);
