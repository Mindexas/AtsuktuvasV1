const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
  name: 'lockdown',
  description: 'Užrakina vieną arba visus pagrindinius serverio kanalus.',
  usage: '<local/global>',
  args: true,
  guildOnly: true,
  permissions: 'ADMINISTRATOR',
  execute(message, args) {
    const civiliurole = message.channel.guild.roles.cache.get("778723059678838834")
    const pagrindinischat = message.guild.channels.cache.get('778672536355340315');
    const offtopicchat = message.guild.channels.cache.get('778672536355340317');
    const nuotraukoschat = message.guild.channels.cache.get('861334298745634866');
    message.delete()
    if (!message.member.hasPermission('ADMINISTRATOR')) return;
    if (args[0] === "global") {

      pagrindinischat.updateOverwrite((civiliurole), { SEND_MESSAGES: false });
      offtopicchat.updateOverwrite((civiliurole), { SEND_MESSAGES: false });
      nuotraukoschat.updateOverwrite((civiliurole), { SEND_MESSAGES: false });
      let lockdownreason = args.slice(1).join(" ")
      if (!lockdownreason) {
        lockdownreason = "Nepažymėta"
      }
      const Embed = new Discord.MessageEmbed()
        .setTitle("**Lockdown**")
        .setDescription("Barmenai supyko ir užrakino bara. **Tu esi neužtildytas** \n Labai prašome dėti nervus i konservus ir mėgautis gyvenimu. \n Priežastis: **" + lockdownreason + "**.")
        .setColor('#ff373f')
      pagrindinischat.send(Embed);
    }
    else if (args[0] === "end") {

      pagrindinischat.updateOverwrite((civiliurole), { SEND_MESSAGES: true });
      offtopicchat.updateOverwrite((civiliurole), { SEND_MESSAGES: true });
      nuotraukoschat.updateOverwrite((civiliurole), { SEND_MESSAGES: true });
      const Embed = new Discord.MessageEmbed()
        .setTitle("**Lockdown**")
        .setDescription("**Baras atidarytas**")
        .setColor('#10ed05')
      pagrindinischat.send(Embed);
      offtopicchat.send(Embed);
      nuotraukoschat.send(Embed);
    }
    else {
      const Embed = new Discord.MessageEmbed()
        .setDescription("Netinkamai pavartota komanda")
        .setColor('#ff373f')
      message.channel.send(Embed)
        .then(d => d.delete({ timeout: 2500 }))
        .catch(console.error())
    }
  }
}
