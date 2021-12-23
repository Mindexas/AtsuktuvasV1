
const db = require('quick.db');
const Discord = require('discord.js');

module.exports = {
    name: "isgryninti",
    description: "is banko i rankas",

    async run (client, message, args) {
        let user = message.author;

        let timeout = 20 * 1000;

        let cd_isgryninti = await db.fetch(`cd_isgryninti_${message.guild.id}_${user.id}`);

        if(cd_isgryninti !== null && timeout - (Date.now() - cd_isgryninti) > 0){
            let time = ms(timeout - (Date.now() - cd_isgryninti));

            return message.channel.send(`Neseniai naudojai šią komandą. Bandyk vėl po : ${time.seconds}s`)
        } else {

            let member2 = db.fetch(`bank_${message.guild.id}_${user.id}`)

            if (args.join(' ').toLocaleLowerCase() == 'all') {
                let money = await db.fetch(`bank_${message.guild.id}_${user.id}`)
                let embed = new Discord.MessageEmbed()
                .setColor("GREEN")
                .setDescription(`**Tavo banke nėra pinigų jų išsiėmimui!**`)
                if (!money) return message.channel.send(message.author, embed)
                db.subtract(`bank_${message.guild.id}_${user.id}`, money)
                db.add(`money_${message.guild.id}_${user.id}`, money)
                let embed5 = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`Tu išsigryninai visus savo banko sąskaitoje turimus pinigus`); 
                message.channel.send(message.author, embed5)

            } else {

                let embed2 = new Discord.MessageEmbed() 
                    .setColor("GREEN")
                    .setDescription(`Nėra pridėto išgryninamo kiekio!`);

                if (!args[0]) {
                    return message.channel.send(message.author, embed2)
                }
                let embed6 = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`Tavo kiekis nėra skaičius!`)

                if(isNaN(args[0])) {
                    return message.channel.send(message.author, embed6)
                }
                let embed3 = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`Tu negali išsigryninti neigiamo kiekio`);

                if (message.content.includes('-')) {
                    return message.channel.send(message.author, embed3)
                }
                let embed4 = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`Tavo banke nėra tiek pinigų!`);

                if (member2 < args[0]) {
                    return message.channel.send(message.author, embed4)
                }

                let embed5 = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`Tu išsigryninai $${args[0]} iš savo banko!`);

                message.channel.send(message.author, embed5)
                db.subtract(`bank_${message.guild.id}_${user.id}`, args[0])
                db.add(`money_${message.guild.id}_${user.id}`, args[0])
            }
        }
    }
}