const fetch = require('node-fetch')
const { sticker } = require('../lib/sticker')
let confirm = {}
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Perintah ini untuk mengambil stiker dari Stickerly berdasarkan pencarian*\n\nContoh penggunaan:\n${usedPrefix + command} spongebob`

    let res = await fetch(global.API('lolhuman', '/api/stickerwa', { query: text }, 'apikey'))
    if (!res.ok) throw 'Server Error.. Harap lapor owner'
    let json = await res.json()
    if (!json.status) throw 'Server error'
    let result = json.result.filter((v, i) => i < 10)
    m.reply(`*Silahkan pilih nomor*\n\n${json.result.map((v, i) => `${i + 1}. ${v.title} (${v.author})`).join('\n')}`)
    confirm[m.sender] = { result }
}

handler.all = async function (m) {
    if (/^([1-9]([0-9])?|stop)$/i.test(m.text)) {
        if (!(m.sender in confirm)) return
        if (/stop/i.test(m.text)) {
            delete confirm[m.sender]
            return !0
        }
        let { result } = confirm[m.sender]
        let t = parseInt(m.text)
        await m.reply(`_Nomor ${t} telah dipilih_`)
        result = result.find((v, i) => i == (t - 1))
        m.reply(`*Nama:* ${result.title}\n*Total stiker:* ${result.stickers.length}`.trim())

        for (let i of result.stickers) {
            let stiker = await sticker(false, i, global.packname, global.author)
            conn.senFile(m.chat, stiker, 'stikerly.webp', '', m)
            await delay(1500)
        }

        delete confirm[m.sender]
        return !0
    }
}
handler.help = ['stikerly <pencarian>']
handler.tags = ['stickerother']
handler.command = /^s(tic?ker)?(ly|wa)$/i
handler.private = true
handler.limit = 2

module.exports = handler

const delay = time => new Promise(res => setTimeout(res, time))