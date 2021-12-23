const Discord = require('discord.js')

module.exports = {
    name: "ping",
    description: "test command",

    async run (client, message, args) {

        var ping = Date.now() - message.createdTimestamp + " ms";
        const pingembed = new Discord.MessageEmbed()
            .setDescription(`⌛ Ping\n${ping} \n\n💓 API Latency\n${client.ws.ping} ms`)
        message.channel.send("Pong!", pingembed); // Parodo laika tarp atrasymo
    }
}