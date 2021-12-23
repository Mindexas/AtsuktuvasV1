const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");
const { logger } = require("@silent-coder/discord-cmd-handler");
const disbut = require('discord-buttons')
let failChance = 50;


module.exports = {
    name: "vogti",
    description: "Vogti iš žmonių pinigus",

    async run (client, message, args){
    if (!args[0]) return message.channel.send("**Įvesk vardą!**")  
    let user2 = message.author

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase());
    if (!user) return message.channel.send("**Įvesk vartotoją!**")

    let embed2 = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`Tu negali apvogti savęs`)

    if (user.user.id === message.author.id) {
      return message.channel.send(message.author, embed2)
    }

    let targetuser = await db.fetch(`money_${message.guild.id}_${user.id}`)
    let author = await db.fetch(`rob_${message.guild.id}_${user2.id}`)
    let author2 = await db.fetch(`money_${message.guild.id}_${user2.id}`)

    let timeout = 10800000; // 10800000

    if (author !== null && timeout - (Date.now() - author) > 0) {
      let time = ms(timeout - (Date.now() - author));

      let timeEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(`Tu neseniai jau bandei apvogti.\n\nBandyk dar kartą po ${time.minutes}m ${time.seconds}s`);
      message.channel.send(message.author, timeEmbed)
    } else {

      let moneyEmbed2 = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(`${user.user.username} neturi nieko ką galėtum pavogti`);

      let random = Math.floor((Math.random() * targetuser)) + 1;

      if (targetuser < random) {
        return message.channel.send(message.author, moneyEmbed2)
      } else {
        let ticketChance = Math.floor(Math.random() * 100) + 1
        logger.info(`[Apiplėšimas] TICKET ${ticketChance} || failChance  ${failChance}`)
        if (ticketChance >= failChance) {
            let embed = new MessageEmbed()
            .setTitle(`Apiplėšimas`)
            .setDescription(`Tu apvogei ${user.user.username} ir pabėgai su $${random}`)
            .setColor("GREEN")
          message.channel.send(message.author,embed)
  
          db.subtract(`money_${message.guild.id}_${user.id}`, random)
          db.add(`money_${message.guild.id}_${user2.id}`, random)
          db.set(`rob_${message.guild.id}_${user2.id}`, Date.now())
          return
        } else {
            if (ticketChance < 20) {
              let embed = new MessageEmbed()
              .setTitle(`🚨🚨🚨 POLICIJA 🚨🚨🚨`)
              .setDescription(`${message.author} buvo pagautas policijos vagiant ir susimokėjo $500 baudą...`)
              .setColor("RED")

              db.subtract(`money_${message.guild.id}_${user2.id}`, 500)
              message.channel.send(message.author, embed)
            } else if (ticketChance < 40 && ticketChance >= 20) {
              let embed = new MessageEmbed()
              .setTitle(`Apiplėšimas`)
              .setDescription(`${message.author} bandė apvogti ${user.user.username}, bet jis vagį pamatė ir jį nubaidė.`)
              .setColor("YELLOW")

              message.channel.send(message.author, embed)
            } else if (ticketChance < 50 && ticketChance >= 40) {
              let embed = new MessageEmbed()
              .setTitle(`Apiplėšimas`)
              .setDescription(`${message.author} bandė apvogti ${user.user.username}, bet jis vagišiui iškvietė policija.\n\n${message.author} norint pabėgti, spausk žalią mygtuką per 5s`)
              .setColor("YELLOW")

              let rndChanceEscape = Math.floor(Math.random() * 5) + 1

              let button1 = new disbut.MessageButton()
              .setStyle('gray')
              .setLabel('Pabėgti') 
              .setID("escape_failed")
              let button2 = new disbut.MessageButton()
              .setStyle('gray')
              .setLabel('Pabėgti') 
              .setID("escape_failed2")
              let button3 = new disbut.MessageButton()
              .setStyle('gray')
              .setLabel('Pabėgti') 
              .setID("escape_failed3")
              let button4 = new disbut.MessageButton()
              .setStyle('gray')
              .setLabel('Pabėgti') 
              .setID("escape_failed4")
              let button5 = new disbut.MessageButton()
              .setStyle('gray')
              .setLabel('Pabėgti') 
              .setID("escape_failed5")


              if (rndChanceEscape === 1) {
                button1 = new disbut.MessageButton()
                .setStyle('green')
                .setLabel('Pabėgti') 
                .setID("escape_success")
              } else if (rndChanceEscape === 2) {
                button2 = new disbut.MessageButton()
                .setStyle('green')
                .setLabel('Pabėgti') 
                .setID("escape_success")
              } else if (rndChanceEscape === 3) {
                button3 = new disbut.MessageButton()
                .setStyle('green')
                .setLabel('Pabėgti') 
                .setID("escape_success")
              } else if (rndChanceEscape === 4) {
                button4 = new disbut.MessageButton()
                .setStyle('green')
                .setLabel('Pabėgti') 
                .setID("escape_success")
              } else if (rndChanceEscape === 5) {
                button5 = new disbut.MessageButton()
                .setStyle('green')
                .setLabel('Pabėgti') 
                .setID("escape_success")
              } else {
                return console.log(rndChanceEscape);
              }

              let msg = message.channel.send(embed, {
                button: [button1,button2,button3,button4,button5],
              })
              .then(m => {
                let filter = (b) => b.clicker.id === message.author.id

                let collector = m.createButtonCollector(filter,  { time: 5000, error: ['time'] });
                collector.on('collect', (b) => {
                    if (b.id === "escape_success") {
                      let embed = new MessageEmbed()
                      .setTitle(`Apiplėšimas`)
                      .setDescription(`${message.author} buvo pagautas asmens vagiant, bet pabėgo...`)
                      .setColor("GREEN")
                      m.edit(message.author, { embed: embed, button : null })
                    } else {
                      let embed = new MessageEmbed()
                      .setTitle(`🚨🚨🚨 POLICIJA 🚨🚨🚨`)
                      .setDescription(`${message.author} buvo pagautas policijos vagiant ir susimokėjo $500 baudą...`)
                      .setColor("RED")
        
                      db.subtract(`money_${message.guild.id}_${user2.id}`, 500)
                      m.edit(message.author, { embed: embed, button : null })
                    }
                    collector.stop()
                    b.reply.defer();
                });
                collector.on('end', (b) => {
                  console.log('end') 
                  let embed = new MessageEmbed()
                      .setTitle(`🚨🚨🚨 POLICIJA 🚨🚨🚨`)
                      .setDescription(`${message.author} nespėjo pabėgti, buvo pagautas policijos vagiant ir susimokėjo $500 baudą...`)
                      .setColor("RED")
        
                      db.subtract(`money_${message.guild.id}_${user2.id}`, 500)
                      m.edit(message.author, { embed: embed, button : null })
                });
              })
            }
        }
      }
    };
  }
} 