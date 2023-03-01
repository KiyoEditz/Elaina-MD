const fetch = require('node-fetch')

const { sticker } = require('../lib/sticker')

let handler = async (m, { conn, args, usedPrefix, command }) => {

    if (!args[0]) throw `*Perintah ini untuk mengambil stiker dari Line*\n\nContoh penggunaan:\n${usedPrefix + command} https://store.line.me/stickershop/product/8149770`
    if (!args[0].match(/(https:\/\/store.line.me\/stickershop\/product\/.*)/gi)) throw `*Perintah ini untuk mengambil stiker dari Line*\n\nContoh penggunaan:\n${usedPrefix + command} https://store.line.me/stickershop/product/8149770`

    let res = await fetch(global.API('lolhuman', '/api/linestick', { url: args[0] }, 'apikey'))
    if (!res.ok) throw 'Server Error.. Harap lapor owner'
    let json = await res.json()
    m.reply(`*Title:* ${json.result.title}`)
    let stiker
    for (let i of json.result.stickers) {
        stiker = await sticker(false, i, global.packname, global.author)
        await conn.sendFile(m.chat, stiker, 'sline', '', m)
        await delay(1500)
    }

}
handler.help = ['stikerline <link>']
handler.tags = ['sticker']
handler.command = /^(stic?kerline)$/i

handler.limit = true

module.exports = handler

const delay = time => new Promise(res => setTimeout(res, time))