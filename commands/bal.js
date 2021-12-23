const db = require('quick.db');
const Discord = require('discord.js');

module.exports = {
    name: "bal",
    description: "Balanso tikrinimas",

    async run (client, message, args) {


        let user = message.mentions.users.first() || message.author;

        let bal = await db.fetch(`money_${message.guild.id}_${user.id}`);
        let balbank = await db.fetch(`bank_${message.guild.id}_${user.id}`);
        if(bal === null) bal = 0;
        if(balbank === null) balbank = 0;

        const Embed = new Discord.MessageEmbed()
        .setTitle(`Balansas`)
        .setDescription(`${user.tag} turi $${bal} savo piniginėje ir $${balbank} banko sąskaitoje.`)
        .setFooter(`${user.tag} likutis`)
        .setTimestamp()

        message.channel.send(Embed)
    }
}