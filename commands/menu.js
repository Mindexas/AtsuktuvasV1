const Discord = require('discord.js');
const { shoppingList } = require('../shoppingList.json')


module.exports = {
    name: "menu",
    description: "Peržiūrėti barmenų meniu",

    async run (client, message, args) {

        const embed = new Discord.MessageEmbed()
        .setTitle('Meniu')
        .setTimestamp()

        for(let i = 0; i < shoppingList.length; i++) {
            embed.addField(`${shoppingList[i].name}`, `$${shoppingList[i].cost}`, true)
        }

        message.channel.send(embed);
    }
}