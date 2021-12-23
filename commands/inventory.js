const db = require('quick.db');
const Discord = require('discord.js');

module.exports = {
    name: "inv",
    description: "Peržiūrėti inventorių",


    async run (client, message, args) {
        let items = await db.fetch(message.author.id);
        if(items === null || items.length <= 0) { 
            items = "Nothing" 
        } 
        const Embed = new Discord.MessageEmbed()
            .addField('Kuprinė', items)
        message.channel.send(Embed);

    }
}