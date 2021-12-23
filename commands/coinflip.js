const db = require('quick.db');
const Discord = require('discord.js');
const client = new Discord.Client();
const { logger } = require('@silent-coder/discord-cmd-handler');
const disbut = require('discord-buttons');

module.exports = {
    name: "coinflip",
    description: "cfp.",

    async run (client, message, args) {

        let userInput = args[0];
        if(!userInput) return message.reply(`Tu privalai pasirinkti "Alus" arba "Vynas"`)
        let stafke = args[1]
        let shaibosPasCiuva = await db.fetch(`money_${message.guild.id}_${message.author.id}`)
        const name = userInput
        const userInputUp = name.charAt(0).toUpperCase() + name.slice(1)
        if(userInputUp !== "Alus" && userInputUp !== "Vynas") return message.reply(`Tu privalai pasirinkti "Alus" arba "Vynas"`)
        if(!stafke) return message.reply("Nepažymėjai kiek nori statyt")
        if(stafke > shaibosPasCiuva) return message.reply("Tu neturi tiek kiek planuoji statyti.")
        if(isNaN(stafke)) return message.reply("Statymas turi būti skaičius.")


        let pvpBtn = new disbut.MessageButton()
            .setStyle('green')
            .setLabel('[PVP] Alus')
            .setID('pvpOn');
        const inputs = ['Alus', 'Vynas']
        let reverseInput;
        if(userInputUp === "Alus") {
            pvpBtn.setLabel('[PVP] Vynas')
        }
        for (let i = 0; i < inputs.length; i++) {
            if(inputs[i] === userInputUp) {
                inputs.splice(i, 1)
                reverseInput = inputs.toString()
            }
        }
        let callBot = new disbut.MessageButton()
            .setStyle('blurple')
            .setLabel('Kviesti botą')
            .setID('botOn')
        

        let pvpEmbed = new Discord.MessageEmbed()
            .setTitle("Coinflip Žaidimas")
            .setDescription(`${message.author} ieško su kuo žaisti! Statymas : ${stafke}\n\n ${message.author} - ${userInputUp}`)
            .setFooter(`Šis žaidimas galioja 120s`);

        let msgOffer = await message.channel.send({ buttons: [pvpBtn, callBot], embed: pvpEmbed })

        const filter = (button) => button.clicker.user.id !== "861274556253077536"; //user filter (author only)
        const collector = msgOffer.createButtonCollector(filter, { time: 120000 }); //collector for 120 seconds

        collector.on('collect', async(b) => {
            if (b.size === 0) return;
            if (b.id === "pvpOn") {
                if (b.clicker.user.id !== message.author.id) {
                    b.reply.defer()
                    let pvpShaibos = await db.fetch(`money_${message.guild.id}_${b.clicker.user.id}`)
                    if (pvpShaibos < stafke) return message.channel.send(`${b.clicker.user}, tu neturi pakankamai pinigų šiai dvikovai.`)
                    pvpBtn.setDisabled();
                    callBot.setDisabled();
                    pvpEmbed.setDescription(`${message.author} - ${userInputUp}\n${b.clicker.user} - ${reverseInput}\n\n**Pradedamas stebėjimas**`)
                    msgOffer.edit({buttons: [pvpBtn, callBot], embed: pvpEmbed })

    
                    const n = Math.floor(Math.random() * 2);
                    let result;
                    if (n === 1) result = 'Alus';
                    else result = 'Vynas';
                    
                    pvpEmbed.setDescription(`${message.author} - ${userInputUp}\n${b.clicker.user} - ${reverseInput}\n\n**Stebimas barmenas...**`)
                    msgOffer.edit(pvpEmbed).then(msg => {
                        setTimeout(() => {
                            if (result === userInputUp) {
                                pvpEmbed.setDescription(`Barmenas išmetė iš rankų "**${result}**"\n\n\nLaimėtojas - ${message.author} \nPralaimėtojas - ${b.clicker.user}`)
                                msg.edit(pvpEmbed);
                                db.add(`money_${message.guild.id}_${message.author.id}`, stafke)
                                db.subtract(`money_${message.guild.id}_${b.clicker.user.id}`, stafke)
                            } else {
                                pvpEmbed.setDescription(`Barmenas išmetė iš rankų "**${result}**"\n\n\nLaimėtojas - ${b.clicker.user} \nPralaimėtojas - ${message.author}`)
                                msg.edit(pvpEmbed);
                                db.subtract(`money_${message.guild.id}_${message.author.id}`, stafke)
                                db.add(`money_${message.guild.id}_${b.clicker.user.id}`, stafke)
                            }
                        }, 3000);
                    });
                }
            }
            if (b.id === "botOn") {
                if (b.clicker.user.id === message.author.id) {
                    b.reply.defer();
                    pvpBtn.setDisabled();
                    callBot.setDisabled();
                    pvpEmbed.setDescription(`${message.author} - ${userInputUp}\n${client.user} - ${reverseInput}\n\n**Pradedamas stebėjimas**`)
                    pvpEmbed.setFooter(``);
                    msgOffer.edit({buttons: [pvpBtn, callBot], embed: pvpEmbed })

                    const n = Math.floor(Math.random() * 2);
                    let result;
                    if (n === 1) result = 'Alus';
                    else result = 'Vynas';
                    let gameResult;
                    if (userInputUp === result) {
                        gameResult = 'laimėjai';
                    } else { 
                        gameResult = 'pralaimėjai';
                    }
                    
                    const embed = new Discord.MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`**Stebimas barmenas...**`)
                    message.channel.send(embed).then(msg => {
                        setTimeout(() => {
                                const embed2 = new Discord.MessageEmbed()
                                .setColor("GREEN")
                                .setDescription(`Barmenui iš rankų iškrito **${result}**. Tu statei už ${userInputUp}, $${stafke} ir tu **${gameResult}**`)
                                msg.edit(`${message.author}, ${client.user}`, embed2)
                                if (gameResult === 'laimėjai') {
                                    db.add(`money_${message.guild.id}_${message.author.id}`, stafke * 0.5)
                                } else {
                                    db.subtract(`money_${message.guild.id}_${message.author.id}`, stafke)
    
                                }
                        }, 3000);
                    })
                }
            }
        });

    }
}
