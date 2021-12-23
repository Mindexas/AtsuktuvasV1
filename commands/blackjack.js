const { stripIndents } = require('common-tags');
function shuffle(array) {
    const arr = array.slice(0);
    for (let i = arr.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
}
const yes = ['yes', 'y', 'ye', 'yea', 'correct'];
const no = ['no', 'n', 'nah', 'nope', 'fuck off'];
const queue2 = new Map();
const queue3 = new Map();
const queue = new Map();
const games = new Map()

let ops = {
    queue2: queue2,
    queue: queue,
    queue3: queue3,
    games: games
}

async function verify(channel, user, { time = 30000, extraYes = [], extraNo = [] } = {}) {
    const filter = res => {
      const value = res.content.toLowerCase();
      return (user ? res.author.id === user.id : true)
        && (yes.includes(value) || no.includes(value) || extraYes.includes(value) || extraNo.includes(value));
    };
    const verify = await channel.awaitMessages(filter, {
      max: 1,
      time
    });
    if (!verify.size) return 0;
    const choice = verify.first().content.toLowerCase();
    if (yes.includes(choice) || extraYes.includes(choice)) return true;
    if (no.includes(choice) || extraNo.includes(choice)) return false;
    return false;
  }

const db = require('quick.db');
const suits = ['♣', '♥', '♦', '♠'];
const faces = ['Jack', 'Queen', 'King'];
const hitWords = ['hit', 'hit me'];
const standWords = ['stand'];

module.exports = {
    name: "bj",
    description: "blackjackas nx",

    async run (client, message, args) {
        return;
        if (!args[0]) return message.reply('**Įveskite kortų kaladžių kiekį!**')
        let deckCount = parseInt(args[0])
        if (isNaN(args[0])) return message.reply('**Prašome įvesti skaičių!**')
        if (deckCount <= 0 || deckCount >= 9) return message.reply("**Pasirinkite skaičių nuo 1 iki 8!**")

        let user = message.author;
        let bal = db.fetch(`money_${message.guild.id}_${user.id}`)
        if (!bal === null) bal = 0;
        if (!args[1]) return message.reply("**Prašome įvesti savo statymą!**")

        let amount = parseInt(args[1])
        if (isNaN(args[1])) return message.reply("**Statymas turi būti skaičius**")
        if (amount > 1000) return message.reply("**Tu negali statyti daugiau nei \`1000\`**")

        if (bal < amount) return message.reply("**Tu bandai statyti daugiau nei turi!**")
        const current = ops.games.get(message.channel.id);
        if (current) return message.reply(`**Prašome palaukti iki kol \`${current.name}\` žaidimas bus baigtas!**`);
        try {
            ops.games.set(message.channel.id, { name: 'blackjack', data: generateDeck(deckCount) });
            const dealerHand = [];
            draw(message.channel, dealerHand);
            draw(message.channel, dealerHand);
            const playerHand = [];
            draw(message.channel, playerHand);
            draw(message.channel, playerHand);
            const dealerInitialTotal = calculate(dealerHand);
            const playerInitialTotal = calculate(playerHand);

            if (dealerInitialTotal === 21 && playerInitialTotal === 21) {
                ops.games.delete(message.channel.id);
                return message.channel.send('**Jūs abu pasiekete BlackJacką!**');
            } else if (dealerInitialTotal === 21) {
                ops.games.delete(message.channel.id);
                db.subtract(`money_${message.guild.id}_${user.id}`, amount);
                return message.channel.send(`**The Dealer Hit Blackjack Right Away!\nNew Balance - **\` ${bal - amount}\``);
            } else if (playerInitialTotal === 21) {
                ops.games.delete(message.channel.id);
                db.add(`money_${message.guild.id}_${user.id}`, amount)
                return message.channel.send(`**You Hit Blackjack Right Away!\nNew Balance -**\`${bal + amount}\``);
            }

            let playerTurn = true;
            let win = false;
            let reason;
            while (!win) {
                if (playerTurn) {
                    await message.channel.send(stripIndents`
						**First Dealer Card -** ${dealerHand[0].display}
						**You [${calculate(playerHand)}] -**
						**${playerHand.map(card => card.display).join('\n')}**
                        \`[Hit / Stand]\`
					`);
                    const hit = await verify(message.channel, message.author, { extraYes: hitWords, extraNo: standWords });
                    if (hit) {
                        const card = draw(message.channel, playerHand);
                        const total = calculate(playerHand);
                        if (total > 21) {
                            reason = `You Drew ${card.display}, Total Of ${total}! Bust`;
                            break;
                        } else if (total === 21) {
                            reason = `You Drew ${card.display} And Hit 21!`;
                            win = true;
                        }
                    } else {
                        const dealerTotal = calculate(dealerHand);
                        await message.channel.send(`**Second Dealer Card Is ${dealerHand[1].display}, Total Of ${dealerTotal}!**`);
                        playerTurn = false;
                    }
                } else {
                    const inital = calculate(dealerHand);
                    let card;
                    if (inital < 17) card = draw(message.channel, dealerHand);
                    const total = calculate(dealerHand);
                    if (total > 21) {
                        reason = `Dealer Drew ${card.display}, Total Of ${total}! Dealer Bust`;
                        win = true;
                    } else if (total >= 17) {
                        const playerTotal = calculate(playerHand);
                        if (total === playerTotal) {
                            reason = `${card ? `Dealer Drew ${card.display}, Making It ` : ''}${playerTotal}-${total}`;
                            break;
                        } else if (total > playerTotal) {
                            reason = `${card ? `Dealer Drew ${card.display}, Making It ` : ''}${playerTotal}-\`${total}\``;
                            break;
                        } else {
                            reason = `${card ? `Dealer Drew ${card.display}, Making It ` : ''}\`${playerTotal}\`-${total}`;
                            win = true;
                        }
                    } else {
                        await message.channel.send(`**Dealer Drew ${card.display}, Total Of ${total}!**`);
                    }
                }
            }
            db.add(`games_${user.id}`, 1)
            ops.games.delete(message.channel.id);
            if (win) {
                db.add(`money_${message.guild.id}_${user.id}`, amount);
                return message.channel.send(`**${reason}, Tu laimėjai ${amount}!**`);
            } else {
                db.subtract(`money_${message.guild.id}_${user.id}`, amount);
                return message.channel.send(`**${reason}, Tu pralaimėjai ${amount}!**`);
            }
        } catch (err) {
            ops.games.delete(message.channel.id);
            throw err;
        }

        function generateDeck(deckCount) {
            const deck = [];
            for (let i = 0; i < deckCount; i++) {
                for (const suit of suits) {
                    deck.push({
                        value: 11,
                        display: `${suit} Ace!`
                    });
                    for (let j = 2; j <= 10; j++) {
                        deck.push({
                            value: j,
                            display: `${suit} ${j}`
                        });
                    }
                    for (const face of faces) {
                        deck.push({
                            value: 10,
                            display: `${suit} ${face}`
                        });
                    }
                }
            }
            return shuffle(deck);
        }

        function draw(channel, hand) {
            const deck = ops.games.get(channel.id).data;
            const card = deck[0];
            deck.shift();
            hand.push(card);
            return card;
        }

        function calculate(hand) {
            return hand.sort((a, b) => a.value - b.value).reduce((a, b) => {
                let { value } = b;
                if (value === 11 && a + value > 21) value = 1;
                return a + value;
            }, 0);
        }
        
    }
}