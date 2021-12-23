const db = require('quick.db');
const Discord = require('discord.js');
const { shoppingList } = require('../shoppingList.json');
const { logger } = require('@silent-coder/discord-cmd-handler');

module.exports = {
    name: "ipilti",
    description: "Įpilk gėrimą į bokalą ar stiklinę.",

    async run (client, message, args) {
        let usingItem = args[0];
        if(!usingItem) return message.channel.send('Parašykite ką norite įpilti')
        let userItems = await db.fetch(message.author.id, { items: [] });
        const name = usingItem
        const usingItemUp = name.charAt(0).toUpperCase() + name.slice(1)
        let itemIndexInList;
        if(userItems.includes(usingItemUp)){
            for(let i = 0; i < shoppingList.length; i++) {
                if(shoppingList[i].name === usingItemUp) {
                    itemIndexInList = i;
                }
            }
            let isgertosPromiles = shoppingList[itemIndexInList].promiles

            let currentPromiles = db.fetch(`promiles_${message.guild.id}_${message.author.id}`)
            console.log(currentPromiles)
            if (currentPromiles === null) {
                currentPromiles = {
                    promiles: 0,
                    expPromiles: 0
                }
            } 
            if (currentPromiles.promiles !== null) {
                let drunkLevel = 0.4
                let allPromiles = isgertosPromiles + currentPromiles.promiles
                if (allPromiles >= drunkLevel) {
                    // message.channel.guild.roles.cache.get('862013944707940352')
                    let drunkRoles = message.guild.roles.cache.get('862013944707940352')
                    message.member.roles.add(drunkRoles);
                    logger.info(`Turetu but roles`)
                }

                let promilesObj = {
                    promiles: allPromiles,
                    expPromiles: Date.now() // 
                }

                var index = userItems.indexOf(usingItemUp);
                if (index > -1) {
                    userItems.splice(index, 1);
                }
                db.set(message.author.id, userItems)
                db.set(`promiles_${message.guild.id}_${message.author.id}`, promilesObj)
                const embed = new Discord.MessageEmbed()
                .setTitle('🍺 Baras 🧔')
                .setDescription(`${message.author} tu išgėrei 1x ${usingItemUp}. \n\n|| Jautiesi apsvaigęs... ||`)
                .setTimestamp()
                message.channel.send(embed)
            }
        }
    }
}