module.exports = {
    name: "clear",
    description: "Clears messages",

    async run (client, message, args) {

        if(message.author.hasPermissions("ADMINISTRATOR")) {
            const amount = args.join(" ");

            if(!amount) return message.reply('Kiek norite ištrinti žinučių?')
    
            if(amount > 100) return message.reply(`Negali ištrinti daugiau nei 100 žinučių.`)
    
            if(amount < 1) return message.reply(`Kodėl tu bandai ištrinti mažiau nei vieną žinutę.`)
    
            await message.channel.messages.fetch({limit: amount}).then(messages => {
                message.channel.bulkDelete(messages)
            });
        }
        
    message.channel.send('Success!')

    }
}