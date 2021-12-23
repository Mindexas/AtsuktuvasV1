const pagination = require('discord.js-pagination');
const Discord = require('discord.js');

module.exports = {
    name: "help",
    description: "The help command, what do you expect?",

    async run (client, message, args){

        //Sort your commands into categories, and make seperate embeds for each category
        const eco = new Discord.MessageEmbed()
        .setTitle('Ekonomika')
        .addField('`.bal`', 'Tikrinti savo balanso likutį')
        .addField('`.daily`', 'Dienpinigių atsiemimas')
        .addField('`.top`', 'Turtingiausių žmonių topai')
        .addField('`.work`', 'Dirbti darbą ir gauti pinigus')
        .addField('`.inesti`', 'Įnešti pinigus į banką')
        .addField('`.isgryninti`', 'Išimti pinigus iš banko')
        .addField('`.vogti`', 'Vogti pinigus iš žmonių')
        .addField('`.coinflip`', 'Coinflip\'as. [Skaičius]/[Herbas]')
        .setTimestamp()

        const inventory = new Discord.MessageEmbed()
        .setTitle('Inventoriai')
        .addField('`.pirkti`', 'Daiktų pirkimas')
        .addField('`.inventory`', 'Inventoriaus tikrinimas')
        .addField('`.menu`', 'Barmenų meniu.')
        .addField('`.ipilti`', 'Įpilk gėrimą į bokalą ar stikliuką')
        .setTimestamp()

        const utility = new Discord.MessageEmbed()
        .setTitle('Kita')
        .addField('`.clear`', 'Žinučių valymas')
        .addField('`.ping`', 'Tikrinti boto (API) pingą')
        .addField('`.weather`', 'Tikrina oro informaciją pateiktoje vietovėje')
        .addField('`.help`', 'Šitas ką skaitai dbr')
        .setTimestamp()

        const experimental = new Discord.MessageEmbed()
        .setTitle('Experimental')
        .addField('`.crash`', 'Crash gamble žaidimas')
        .setTimestamp()

        const pages = [
                eco,
                inventory,
                utility,
                experimental
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '60000';

        pagination(message, pages, emojiList, timeout)
    }
}