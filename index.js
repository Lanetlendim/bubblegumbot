const express = require('express')
const expressApp = express()
const axios = require("axios");
const path = require("path")
const port = process.env.PORT || 3000;
expressApp.use(express.static('static'))
expressApp.use(express.json());
require('dotenv').config();

const {
    Telegraf
} = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

expressApp.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});
bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Bubblegum bot', {
        reply_markup: {
            keyboard: [
                ["Vitrin"],
                ["Kurallar"]
            ]
        }
    })
})

bot.command('ethereum', ctx => {
    var rate;
    console.log(ctx.from)
    axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)
        .then(response => {
            console.log(response.data)
            rate = response.data.ethereum
            const message = `Hello, today the ethereum price is ${rate.usd}USD`
            bot.telegram.sendMessage(ctx.chat.id, message, {})
        })
})

expressApp.use(bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook('<YOUR_CAPSULE_URL>/secret-path')

// bot.launch()

expressApp.listen(port, () => console.log(`Listening on ${port}`));