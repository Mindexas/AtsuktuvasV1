const Discord = require('discord.js');

const client = new Discord.Client();

const { logger } = require("@silent-coder/discord-cmd-handler");

const { token, default_prefix } = require('./config.json');

const ms = require('parse-ms');

const fetch = require("node-fetch")

const { readdirSync } = require('fs');

const disbut = require('discord-buttons');
disbut(client);

const config = require('./config.json');
client.config = config;

const db = require('quick.db');

Array.prototype.shuffle = function() {
    var i = this.length;
    if (i == 0) return this;
    while (--i) {
        var j = Math.floor(Math.random() * (i + 1 ));
        var a = this[i];
        var b = this[j];
        this[i] = b;
        this[j] = a;
    }
    return this;
};


client.commands= new Discord.Collection();
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}


client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag} Successfully..!!`)
    client.user.setPresence({
        status: "online",
        game: {
            name: "Bot in ALPHA",
            type: "WATCHING" //PLAYING: WATCHING: LISTENING: STREAMING:
        }
    });
});

client.on("message", async message => {


    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    // timeout - (Date.now() - daily) > 0


    let prefix = "."
    // if(prefix === null) prefix = default_prefix;

    if(message.content.startsWith(prefix)) {

        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        const command = args.shift().toLowerCase();

        if(!client.commands.has(command)) return;

        try {
            client.commands.get(command).run(client, message, args);

        } catch (error){
            console.error(error);
        }
    } else {
        db.add(`bank_${message.guild.id}_${message.author.id}`, 1)
        let girtumas = db.fetch(`promiles_${message.guild.id}_${message.author.id}`)
        if (girtumas !== null) {
            let timeout = girtumas.promiles * 10 * 60 * 1000
            if(timeout - (Date.now() - girtumas.expPromiles) <= 0){
                let Embed = new Discord.MessageEmbed()
                .setTitle("Girtumas")
                .setDescription(`${message.author} išsiblaivė...`)
                .setTimestamp()
                message.channel.send(message.author, Embed)
                let drunkRoles = message.guild.roles.cache.get('862013944707940352')
                message.member.roles.remove(drunkRoles)
                db.delete(`promiles_${message.guild.id}_${message.author.id}`);
            } else {
                message.delete()
                let s = message.content;
                var shuffledSentence = s.split(' ').shuffle().join(' ');
                message.channel.send(`${message.author} sako : ${shuffledSentence}`)
            }
            let left = timeout - (Date.now() - girtumas.expPromiles)
            let leftg = ms(left)
            logger.info(`${message.author.tag} girtumo liko :  ${leftg.minutes}m, ${leftg.seconds}s`)
        }
    }
})

process.on("unhandledRejection", _ => logger.error(_.stack + '\n' + '='.repeat(20)))

client.login(token);
