
const {SlashCommandBuilder}=require('discord.js');
const eco=require('../modules/economy');

module.exports={
 data:new SlashCommandBuilder().setName('economie').setDescription('Menu économie'),
 async execute(i){ eco.panel(i); }
};
