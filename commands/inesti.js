
const db = require('quick.db');
const Discord = require('discord.js');

module.exports = {
    name: "inesti",
    description: "i banka inesti shaibas",

    async run (client, message, args) {
        let user = message.author;

        let timeout = 20 * 1000;

        let cd_inesti = await db.fetch(`cd_inesti_${message.guild.id}_${user.id}`);

        if(cd_inesti !== null && timeout - (Date.now() - cd_inesti) > 0){
            let time = ms(timeout - (Date.now() - cd_inesti));

            return message.channel.send(`Neseniai naudojai šią komandą. Bandyk vėl po : ${time.seconds}s`)
        } else {
            let member = db.fetch(`money_${message.guild.id}_${user.id}`)

            if (args[0] == 'all') {
                let money = await db.fetch(`money_${message.guild.id}_${user.id}`)

                let embedbank = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setDescription("Neturi pinigų, ką padėti į banką.")

                if (!money) return message.channel.send(message.author, embedbank)

                db.subtract(`money_${message.guild.id}_${user.id}`, money)
                db.add(`bank_${message.guild.id}_${user.id}`, money)
                let sembed = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`Tu padėjai visus savo pinigus į banką`);
                message.channel.send(message.author, sembed)

            } else {

                let embed2 = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`Neparašei kiek nori idėti pinigų į banką.`);

                if (!args[0]) {
                    return message.channel.send(message.author, embed2)
                        .catch(err => message.channel.send(err.message))
                }
                let embed6 = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`Tavo kiekis nėra skaičius!`)

                if(isNaN(args[0])) {
                    return message.channel.send(message.author, embed6)
                
                }
                let embed3 = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`Tu negali įdėti neigiamo skaičiaus į banką`);

                if (message.content.includes('-')) {
                    return message.channel.send(message.author, embed3)
                }
                let embed4 = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`Tu neturi tiek pinigų`);

                if (member < args[0]) {
                    return message.channel.send(message.author, embed4)
                }

                let embed5 = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`Tu idėjai $${args[0]} į savo banko saskaitą`);

                message.channel.send(message.author, embed5)
                db.subtract(`money_${message.guild.id}_${user.id}`, args[0])
                db.add(`bank_${message.guild.id}_${user.id}`, args[0])

            }
        }
    }
}