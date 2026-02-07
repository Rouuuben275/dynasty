
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const config = require('../config.json');
const {load,save} = require('./db');

function user(id){
  const d = load();
  if(!d.users[id]){
    d.users[id]={
      money:config.economy.startMoney,
      bank:0,
      salary:1200,
      job:"citizen",
      entreprise:null,
      vehicles:[]
    };
    save(d);
  }
  return d.users[id];
}

async function panel(i){
  const u = user(i.user.id);

  const e = new EmbedBuilder()
   .setTitle("💳 Banque & Économie")
   .setColor(config.style.color)
   .setDescription(
    `**Liquide:** $${u.money}\n`+
    `**Banque:** $${u.bank}\n`+
    `**Salaire:** $${u.salary}`
   );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('eco_shop').setLabel('🚗 Concession').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('eco_bank').setLabel('🏦 Banque').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('eco_ent').setLabel('🏢 Entreprise').setStyle(ButtonStyle.Success)
  );

  i.reply({embeds:[e],components:[row],ephemeral:true});
}

async function shop(i){
  const d = load();

  const menu = new StringSelectMenuBuilder()
   .setCustomId('buy_vehicle')
   .setPlaceholder('Acheter un véhicule');

  for(const v of d.vehiclesShop){
    menu.addOptions({
      label:v.model,
      description:`$${v.price}`,
      value:v.model+"_"+v.price
    });
  }

  i.reply({components:[new ActionRowBuilder().addComponents(menu)],ephemeral:true});
}

async function buy(i){
  const [model,price] = i.values[0].split("_");
  const u = user(i.user.id);

  if(u.money < +price)
    return i.reply({content:"❌ Pas assez d'argent",ephemeral:true});

  u.money -= +price;
  u.vehicles.push({model,id:Date.now()});

  const d = load();
  d.users[i.user.id]=u;
  save(d);

  i.reply({content:`✅ Achat réussi: **${model}**`,ephemeral:true});
}

function payday(client){
  setInterval(()=>{
    const d = load();

    for(const id in d.users){
      const u=d.users[id];

      // FUN + REALISTE
      let bonus = Math.floor(Math.random()*200);
      let taxe = Math.floor(u.salary*config.economy.tax);

      u.bank += u.salary + bonus - taxe;
    }

    save(d);
  }, config.economy.paydayMinutes*60000);
}

async function buttons(i){
  if(i.customId==='eco_shop') shop(i);
}

async function menus(i){
  if(i.customId==='buy_vehicle') buy(i);
}

module.exports={panel,payday,buttons,menus};
