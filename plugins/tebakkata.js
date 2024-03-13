let fs = require('fs')
let timeout = 30000
let poin = 400
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakkata = conn.tebakkata ? conn.tebakkata : {}
    let id = m.chat
    if (id in conn.tebakkata) {
        if (conn.tebakkata[id].length !== 0) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkata[id][0])
        delete conn.tebakkata[id]
        throw false
    }
    conn.tebakkata[id] = []
    let src = JSON.parse(fs.readFileSync(`./src/scrap/tebakkata.json`))
    let json = src[Math.floor(Math.random() * src.length)]

    // conn.scrapGame(global.API('lolhuman', '/api/tebak/kata', '', 'apikey'), 'tebakkata').catch(e => e)

    let question = json.result.pertanyaan
    let caption = `
*TEBAK KATA*
*Clue/Petunjuk:* ${question}

Waktu Jawab: *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
*Reply pesan ini untuk menjawab!*`.trim()

let msg = await m.reply(caption)
    conn.tebakkata[id] = [
        msg,
        json, poin,
        setTimeout(() => {
            if (conn.tebakkata[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.jawaban}*`, conn.tebakkata[id][0])
            conn.sendMessage(m.chat, { delete: msg.key }).catch(e => e)
            delete conn.tebakkata[id]
        }, timeout)
    ]
}
handler.help = ['tebakkata']
handler.tags = ['game']
handler.command = /^tebakkata$/i
handler.group = true
handler.limit = false
module.exports = handler