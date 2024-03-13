let fs = require('fs')
let timeout = 30000
let poin = 500
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebaklirik = conn.tebaklirik ? conn.tebaklirik : {}
    let id = m.chat
    if (id in conn.tebaklirik) {
        if (conn.tebaklirik[id].length !== 0) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaklirik[id][0])
        delete conn.tebaklirik[id]
        throw false
    }
    conn.tebaklirik[id] = []
    let src = JSON.parse(fs.readFileSync(`./src/scrap/tebaklirik.json`))
    let json = src[Math.floor(Math.random() * src.length)]

    // conn.scrapGame(global.API('lolhuman', '/api/tebak/lirik', '', 'apikey'), 'tebaklirik').catch(e => e)

    let question = json.result.question
    // if (!json.status) throw json
    let caption = `
*TEBAK LIRIK*
Isi lirik kosong dibawah ini

*Lirik:* ${question}

Waktu Jawab: *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
*Reply pesan ini untuk menjawab!*`.trim()
    conn.tebaklirik[id] = [
        await m.reply(caption),
        json, poin,
        setTimeout(() => {
            if (conn.tebaklirik[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.answer}*`, conn.tebaklirik[id][0])
            delete conn.tebaklirik[id]
        }, timeout)
    ]
}
handler.help = ['tebaklirik']
handler.tags = ['game']
handler.command = /^tebaklirik$/i
handler.limit = false
handler.group = true
module.exports = handler