const db = require('quick.db');
const Discord = require('discord.js');
const pagination = require('discord.js-pagination');
const { logger } = require('@silent-coder/discord-cmd-handler');


module.exports = {
    name: "top",
    description: "Serverio leaderboardas",

    async run (client, message, args) {
        let money = db.startsWith(`money_${message.guild.id}`, { sort: '.data' })
        let bankmoney = db.startsWith(`bank_${message.guild.id}`, { sort: '.data' })

        let content = "";
        let bankcontent = "";

        for (let i = 0; i < 10; i++){
            let user = client.users.cache.get(money[i].ID.split('_')[2]).username

            content += `${i+1}. ${user} - $${money[i].data} \n`;
        }
        
        for (let i = 0; i < 10; i++){
            let userObj = client.users.cache.get(bankmoney[i].ID.split('_')[2])
            if (userObj !== undefined) {
                logger.info(userObj)
                let user = userObj.username
                bankcontent += `${i+1}. ${user} - $${bankmoney[i].data} \n`;
            }
        }

        const walletMoney = new Discord.MessageEmbed()
        .setTitle(`${message.guild.name} storiausios piniginės`)
        .setDescription(`${content}`)
        .setColor("RANDOM")
        .setTimestamp()

        const bank = new Discord.MessageEmbed()
        .setTitle(`${message.guild.name} didžiausi banko likučiai`)
        .setDescription(`${bankcontent}`)
        .setColor("RANDOM")
        .setTimestamp()

        const pages = [
            walletMoney,
            bank
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '60000';

        pagination(message, pages, emojiList, timeout)
    }
}