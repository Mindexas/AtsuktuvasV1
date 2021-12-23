const Discord = require('discord.js')
const db = require('quick.db');
const ms = require('parse-ms');

module.exports = {
    name: "daily",
    description: "Dienpinigių atsiemimas",

    async run (client, message, args) {
        let user = message.author;
        let timeout = 1; // 86400000
        let amount = 100000;

        let daily = await db.fetch(`daily_${message.guild.id}_${user.id}`);

        if(daily !== null && timeout - (Date.now() - daily) > 0){
            let time = ms(timeout - (Date.now() - daily));

            return message.channel.send(`Tu jau atsiemiai savo dienpinigius. Bandyk dar kartą po ${time.days}d, ${time.hours}h, ${time.minutes}m, ir ${time.seconds}s`)
        } else {
            db.add(`money_${message.guild.id}_${user.id}`, amount);
            db.set(`daily_${message.guild.id}_${user.id}`, Date.now());
            const embed = new Discord.MessageEmbed()
            .setTitle('Dienpinigiai')
            .setDescription(`Sėkmingai pridėta $${amount} prie tavo paskyros.`)
            .setTimestamp()

            message.channel.send(message.author, embed)
        }
    }
}