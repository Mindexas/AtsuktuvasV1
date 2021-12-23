const db = require('quick.db');
const Discord = require('discord.js');
const client = new Discord.Client();
const { logger } = require('@silent-coder/discord-cmd-handler');
const disbut = require('discord-buttons');


module.exports = {
    name: "crash",
    description: "Clears messages",

    async run (client, message, args) {

        let activatedGame = db.fetch(`crash_${message.channel.id}`)

        if (activatedGame !== null) return message.reply(`Šiame kanale jau yra pradėtas Crash žaidimas. Palauk, kol jis pasibaigs.`)

        db.set(`crash_${message.channel.id}`, 1)
        let min = 1;
        let max = 10;
        let gen = max / (Math.random() * max + min); 
        let GameTicket = gen.toFixed(2)

        let gameStarted = false;
        let currentMultiplier = 1;
        let timerLeft = 15;
        let playingUsers = [];

        let Embed = new Discord.MessageEmbed()
            .setTitle('Crash žaidimas')
            .setColor('#f1c40f')
            .setDescription(`Žaidimas prasidės po ${timerLeft}`)
            .setTimestamp();
        let joingamebtn = new disbut.MessageButton()
            .setStyle('blurple')
            .setLabel('Prisijungti')
            .setID('joingame');
        let cashOutBtn = new disbut.MessageButton()
            .setStyle('green')
            .setLabel('CashOut')
            .setID('cashout');

        function checkForExisting(button) {
            for (let i = 0; i < playingUsers.length; i++) {
                if (playingUsers[i].user === button.clicker.user.id) {
                    return true;
                } else {
                    return false;
                }
            }
        }


        message.channel.send({ buttons: [joingamebtn], embed: Embed }).then(msg => {
            const filter = (button) => playingUsers.includes(button.clicker.user.id) == false;
            const collector = msg.createButtonCollector(filter, { time: 60000 });

            collector.on('collect', async(b) => {
                if (b.size === 0) return;
                if (b.id === 'joingame') {
                    if(checkForExisting(b)) {
                        logger.info(`existing user detected`)
                        return
                    }
                    b.reply.send(`Parašykite į chatą, kiek norite statyti ant šio žaidimo.`, true)
                    const filter = m => m.author.id === b.clicker.user.id;
                    const msgCollector = message.channel.createMessageCollector(filter, { time: 15000, max: 1 });
                    let stafke;
                    msgCollector.on('collect', m => {
                        const shaibosPasCiuva = db.fetch(`money_${message.guild.id}_${m.author.id}`);
                        let input = parseInt(m.content);
                        if(m.content > shaibosPasCiuva) {
                            m.delete()
                            b.reply.edit("Tu neturi tiek kiek planuoji statyti.\n Jei nori pakartoti, spausk \"Prisijungti\".", true);
                            msgCollector.stop();
                            return;
                        } else if(isNaN(m.content)) {
                            m.delete()
                            b.reply.edit("Kiekis kurį nori statyti nėra skaičius\n Jei nori pakartoti, spausk \"Prisijungti\".");
                            msgCollector.stop();
                            return;
                        } else {
                            stafke = m.content;
                            let gameObj = {
                                user: b.clicker.user.id,
                                stafke: stafke,
                            }
        
                            playingUsers.push(gameObj)
        
                            b.reply.edit('Sėkmingai prisijungei į crash game.', true)
                            m.delete();
                            msgCollector.stop();
                        }
                    });
                }
            }) 

            const Timer = setInterval(() => {
                if (timerLeft > 0) {
                    timerLeft = timerLeft - 1
                    Embed.setDescription(`Žaidimas prasidės po ${timerLeft}`)
                    msg.edit({ buttons: [joingamebtn], embed: Embed });
                } else {
                    collector.stop();
                    clearInterval(Timer);
                    if (playingUsers.length > 0) {
                        Embed.setDescription(`[API] Waiting for clearance...\n\n Palaukite, žaidimas prasidės netrukus.`);
                        Embed.setColor('#f1c40f');
                        msg.edit({embed : Embed , components: null })
                        setTimeout(() => {
                            Embed.setDescription(`Crash multiplier\n⠀⠀⠀⠀⠀${currentMultiplier}x`);
                            Embed.setColor('#2ecc71');
                            msg.edit({embed : Embed , components: null })
                            msg.edit({ buttons: [cashOutBtn], embed: Embed });
                            gameStarted = true;
                            game(msg);
                        }, 5000);
                    } else {
                        Embed.setDescription(`Nėra žaidėjų šiam žaidimui vykdyti, todėl jis buvo nutrauktas.`)
                        msg.edit({ buttons: null, embed: Embed });
                        db.delete(`crash_${message.channel.id}`);
                    }
                }
            }, 1250);

            function game(fmsg) {
                    logger.info(`Crash: ${GameTicket}`)
                    let currentMultiplierFixed = 1;
                    let gameInterval = setInterval(() => {
                        if (gameStarted == true) {
                            if (currentMultiplierFixed >= GameTicket) {
                                gameStarted = false;
                                Embed.setDescription(`Crashed @ ${currentMultiplierFixed}x`)
                                Embed.setColor('#e74c3c')
                                Embed.setFooter(`GAME OVER`)
                                fmsg.edit({ buttons: null, embed: Embed })
                                for(let i = 0; i < playingUsers.length; i++) {
                                    let user = playingUsers[i].user;
                                    let stafke = playingUsers[i].stafke;
                                    db.subtract(`money_${message.guild.id}_${user}`, stafke)
                                    logger.info(`[DB] Subtracted ${stafke} from ${user}`)
                                }
                                stopCollector();
                                clearInterval(gameInterval)
                                db.delete(`crash_${message.channel.id}`);
                                return;
                            }
                            Embed.setDescription(`Crash multiplier\n⠀⠀⠀⠀⠀${currentMultiplierFixed}x`)
                            msg.edit({ embed: Embed });
                            currentMultiplier = currentMultiplier * 1.1
                            currentMultiplierFixed = currentMultiplier.toFixed(1)
                        } else {
                            clearInterval(gameInterval)
                        }
                        
                    }, 2000);
                    const filter = (button) => checkForExisting(button) == true; //user filter (author only)
                    const gameCollector = fmsg.createButtonCollector(filter, { time: 300000 }); //collector for 120 seconds
        
                    gameCollector.on('collect', async(b) => {
                        if (b.size === 0) return;
                        if (b.id === 'cashout') {
                            logger.info(`cashout btn detected`)
                            b.reply.send(`Tu cashout'inai @ ${currentMultiplierFixed}`, true)

                            let allCash;
                            let user;
                            for (let i = 0; i < playingUsers.length; i++) {
                                if (playingUsers[i].user === b.clicker.user.id) {
                                    allCash = Math.floor(playingUsers[i].stafke * currentMultiplierFixed) - playingUsers[i].stafke
                                    user = playingUsers[i].user
                                    playingUsers.splice(playingUsers[i], 1)
                                    db.add(`money_${message.guild.id}_${b.clicker.user.id}`, allCash)
                                }
                            } 
                            logger.info(`[DB] Added ${allCash} from ${user}`)
                        }
                    }) 
                    function stopCollector() {
                        gameCollector.stop();
                    }
                }
        })
    }
}