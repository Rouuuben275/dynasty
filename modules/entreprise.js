
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const config = require('../config.json');
const {load,save} = require('./db');

async function panel(i){

  const e = new EmbedBuilder()
   .setTitle("🏢 Système Entreprise")
   .setDescription(
    "• Création → validation STAFF\n"+
    "• Patrons gèrent payes\n"+
    "• Recrutement employés\n"+
    "• Argent réel entreprise"
   )
   .setColor(config.style.color);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ent_request').setLabel('Créer Entreprise').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('ent_manage').setLabel('Gérer mon entreprise').setStyle(ButtonStyle.Primary)
  );

  i.reply({embeds:[e],components:[row],ephemeral:true});
}

async function request(i){
  const d = load();
  const id = "REQ-"+Date.now();

  d.entreprises[id]={
    name:"En attente",
    owner:i.user.id,
    validated:false,
    balance:8000,
    salary:1000,
    employees:[],
    logs:[]
  };

  save(d);

  i.reply({content:"✅ Demande envoyée au STAFF",ephemeral:true});
}

async function manage(i){
  const d = load();

  const ent = Object.entries(d.entreprises)
   .find(e=>e[1].owner===i.user.id && e[1].validated);

  if(!ent)
    return i.reply({content:"❌ Aucune entreprise validée",ephemeral:true});

  const [id,info]=ent;

  const e = new EmbedBuilder()
   .setTitle("Panel Patron")
   .setColor(config.style.color)
   .setDescription(
    `**Solde:** $${info.balance}\n`+
    `**Employés:** ${info.employees.length}\n`+
    `**Salaire:** $${info.salary}`
   );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ent_pay').setLabel('Payer employés').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('ent_recruit').setLabel('Recruter').setStyle(ButtonStyle.Primary)
  );

  i.reply({embeds:[e],components:[row],ephemeral:true});
}

async function buttons(i){
  if(i.customId==='ent_request') request(i);
  if(i.customId==='ent_manage') manage(i);
}

module.exports={panel,buttons};
