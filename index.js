const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cors = require('cors')

const token = '5714815796:AAFd8hR7U75My1pTlB3J8ocho5PF8-24RjU'
const webAppUrl = 'https://elaborate-dusk-517bc0.netlify.app'

const bot = new TelegramBot(token, {polling: true});
const app = express()

app.use(express.json())
app.use(cors())


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text

    if (text === '/start') {
        await bot.sendMessage(chatId, 'Внизу зявиться кнопка, заповніть форму', {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Заповніть форму", web_app: {url: webAppUrl + '/form'}}]
                ]


            }
        })
        await bot.sendMessage(chatId, 'Внизу зявиться кнопка, заповніть форму', {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Замовити", web_app: {url: webAppUrl}}]
                ]


            }
        })
    }
    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            await bot.sendMessage(chatId, 'Дякую, що надіслали дані')
            await bot.sendMessage(chatId, 'Ваша країна: ' + data?.country)
            await bot.sendMessage(chatId, 'Ваша вулиця: ' + data?.street)

            setTimeout(async () => {
                await (chatId, 'Уся інформація доступна у чаті')
            }, 2000)

        } catch (e) {
            console.log(e)
        }
    }
});

app.post('/web-data', async (req, res) => {
    const {queryId, product, totalPrice} =req.body
    try{
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успішна операція',
            input_message_content: {message_text: `Вітаю з покупкою, ви купил на суму ${totalPrice} на все добре!`}
        })
        return res.status(200).json({})
    }catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Невдалось зробити покупку',
            input_message_content: {message_text: `Невдалось зробити покупку`}
        })
        return res.status(500).json({})

    }
})

const PORT = 8000
app.listen(PORT, () => console.log(`server started on PORT ${PORT}...`))