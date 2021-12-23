const db = require('quick.db');
const Discord = require('discord.js');

const disbut = require('discord-buttons')
const ms = require('parse-ms');
const { logger } = require('@silent-coder/discord-cmd-handler');

module.exports = {
    name: "work",
    description: "Work your a** off",

    async run (client, message, args) {
        let user = message.author;
        let timeout = 300 * 1000 ; // 300 * 1000 
        let author = await db.fetch(`worked_${message.guild.id}_${user.id}`);
        let authorMoney = await db.fetch(`money_${message.guild.id}_${user.id}`);
        let authorMoneyBank = await db.fetch(`bank_${message.guild.id}_${user.id}`);
        let authorMoneyAll = authorMoney + authorMoneyBank
        let possibleNeg;
        if (authorMoneyAll < 56) {
            possibleNeg = false;
        } else {
            possibleNeg = true;
        }

        let replies = [
            {
                text: "Pagaminai skanu kokteilį",
                type: "good"
            },
            {
                text: "Atidarei duris alkoholikui",
                type: "good"
            },
            {
                text: "Gavai arbatpinigiu",
                type: "good"
            },
            {
                text: "Tau sumokėjo už baro tualetą",
                type: "good"
            },
            {
                text: "Klientas išvertė kokteilį",
                type: "bad"
            },
            {
                text: "Klientui nepatiko tavo kokteilis ir teko grąžinti pinigus",
                type: "bad"
            },
            {
                text: "Blogai pagaminai kokteilį pagal proporcijas ir baras iš tavęs nuskaiciavo pinigus",
                type: "bad"
            },
            {
                text: "Aluje per daug putų, teks pilti iš naujo",
                type: "bad"
            },
        ]
        // let replies = ['apiplėšei močiutę ir gavai','radai ant žemės','apiplešei kioską ir gavai', 'tu iš kasos pasiemei']

        let types = ["good", "bad"];
        let result = Math.floor((Math.random() * types.length));
        types.splice(result, 1)
        let possibleResults = [];

        for(let i = 0; i < replies.length; i++){
            if (types.includes("good")) {
                if(replies[i].type === "good") {
                    possibleResults.push(replies[i].text);
                }
            } else {
                if(replies[i].type === "bad") {
                    possibleResults.push(replies[i].text);
                }
            }
        }
        let resultNo = Math.floor((Math.random() * possibleResults.length));

        if(author !== null && timeout - (Date.now() - author) > 0){
            let time = ms(timeout - (Date.now() - author));
            return message.channel.send(`Tu galėsi dirbti už ${time.minutes}m ir ${time.seconds}s`)
        } else {
            if (types.includes("good")) {
                let amount = Math.floor(Math.random() * 15) + 1;
                db.add(`money_${message.guild.id}_${user.id}`, amount)
                db.set(`worked_${message.guild.id}_${user.id}`, Date.now())
    
                const embed = new Discord.MessageEmbed()
                .setTitle('⚙️ Darbas ⚙️')
                .setDescription(`${user}, ${possibleResults[resultNo]} $${amount}`)
                .setTimestamp()
    
                message.channel.send(embed)
            } else {
                if (possibleNeg == true) {

                } else {
                    let amount = Math.floor(Math.random() * 8) + 1;
                    db.add(`money_${message.guild.id}_${user.id}`, amount)
                    db.set(`worked_${message.guild.id}_${user.id}`, Date.now())
        
                    const embed = new Discord.MessageEmbed()
                    .setTitle('⚙️ Darbas ⚙️')
                    .setDescription(`${user}, gavai pašalpą $${amount}`)
                    .setTimestamp()
        
                    message.channel.send(embed)
                    return;
                }
                let amount = Math.floor(Math.random() * 8) + 1;
                db.add(`money_${message.guild.id}_${user.id}`, -amount)
                db.set(`worked_${message.guild.id}_${user.id}`, Date.now())
    
                const embed = new Discord.MessageEmbed()
                .setTitle('⚙️ Darbas ⚙️')
                .setDescription(`${user}, ${possibleResults[resultNo]} -$${amount}`)
                .setImage(`https://c.tenor.com/Ysu5uHCclJYAAAAM/waiter-beers.gif`)
                .setTimestamp()
    
                message.channel.send(embed)
            }
            
        }
    }
}