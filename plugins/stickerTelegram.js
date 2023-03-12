const fetch = require('node-fetch')

const { sticker } = require('../lib/sticker')
let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `*Perintah ini untuk mengambil stiker dari Telegram*\n\nContoh:\n${usedPrefix + command} https://t.me/addstickers/menggokil`
    if (!args[0].match(/(https:\/\/t.me\/addstickers\/)/gi)) throw `*Link salah!*\n\nContoh:\n${usedPrefix + command} https://t.me/addstickers/menggokil`

    let res = await fetch(global.API('lolhuman', '/api/telestick', { url: args[0] }, 'apikey'))
    if (!res.ok) throw 'Server Error.. Harap lapor owner'
    let json = await res.json()
    let mes = json.result.sticker.map((v, i) => `${i + 1}. ${v}`).join('\n')
    m.reply(`
*${json.result.title}*
*Total:* ${json.result.sticker.length}\n*Estimasi selesai:* ${json.result.sticker.length * 2} detik\n\n` + mes)
    let stiker
    for (let i of json.result.sticker) {
        stiker = await sticker(false, i, global.packname, global.author)
        conn.sendFile(m.chat, stiker, 'stikertele', '', m)
        await delay(2000)
    }
}
handler.help = ['stikertelegram <link>']
handler.tags = ['sticker']
handler.command = /^(stic?kertele(gram)?)$/i
handler.limit = true

module.exports = handler

const delay = time => new Promise(res => setTimeout(res, time))