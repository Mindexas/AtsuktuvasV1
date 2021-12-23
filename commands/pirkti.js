const db = require('quick.db');
const Discord = require('discord.js');

const { shoppingList } = require('../shoppingList.json');

module.exports = {
    name: "pirkti",
    description: "Gėrimų užsakymas pas barmeną.",

    async run (client, message, args) {
        let purchasing = args[0];
        if(!purchasing) return message.channel.send('Pasirink ką nori pirkti.')
        let items = await db.fetch(message.author.id, { items: [] });
        let amount = await db.fetch(`money_${message.guild.id}_${message.author.id}`)

        const name = purchasing
        const purchase = name.charAt(0).toUpperCase() + name.slice(1)


        var found = false;
        var shoppingListIndex = null;
        for(var i = 0; i < shoppingList.length; i++) {
            if (shoppingList[i].name == purchase) {
                found = true;
                shoppingListIndex = i;
                break;
            }
        }

        if (found == true) {
            if(shoppingList[shoppingListIndex].cost > amount) return message.channel.send('Tu neturi pakankamai pinigų, jog nusipirktum tą gerimą.');
            db.subtract(`money_${message.guild.id}_${message.author.id}`, shoppingList[shoppingListIndex].cost);
            db.push(message.author.id, `${shoppingList[shoppingListIndex].name}`);
            const Embed = new Discord.MessageEmbed()
            .setTitle(`Parduotuvė`)
            .setDescription(`1x ${shoppingList[shoppingListIndex].name}\n\nSąskaita : $${shoppingList[shoppingListIndex].cost}`)
            .setFooter(`Fiskalinis Kvitas`)
            .setTimestamp()
            message.channel.send(message.author, Embed);
        }
    }
}