
const {SlashCommandBuilder}=require('discord.js');
const ent=require('../modules/entreprise');

module.exports={
 data:new SlashCommandBuilder().setName('entreprise').setDescription('Menu entreprise'),
 async execute(i){ ent.panel(i); }
};
