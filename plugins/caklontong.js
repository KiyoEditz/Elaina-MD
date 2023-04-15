let fetch = require('node-fetch')
let fs = require('fs')
let timeout = 30000
let poin = 700
let handler = async (m, { conn, usedPrefix }) => {
    conn.caklontong = conn.caklontong ? conn.caklontong : {}
    let id = m.chat
    if (id in conn.caklontong) {
        if (conn.caklontong[id].length !== 0) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.caklontong[id][0])
        delete conn.caklontong[id]
        throw false
    }
    conn.caklontong[id] = []
    let src = JSON.parse(fs.readFileSync(`./src/scrap/caklontong.json`))
    let json = src[Math.floor(Math.random() * src.length)]

    conn.scrapGame(global.API('lolhuman', '/api/tebak/caklontong2', '', 'apikey'), 'caklontong').catch(_ => _)

    // if (!json.status) throw json
    let caption = `
*Soal:* ${json.result.question}

Waktu Jawab: *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
*Reply pesan ini untuk menjawab!*`.trim()
    let btn = await conn.reply(m.chat, caption + `\n*TEBAK CAK LONTONG*\n*ALERT!! Soal ini menguji kesabaran kamu ^_^*\nBantuan mengurangi 1 limit`, m)
    conn.caklontong[id] = [
        btn,
        json, poin,
        setTimeout(() => {
            if (conn.caklontong[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.answer}*\nAlasan: ${json.result.information}`, conn.caklontong[id][0])
            delete conn.caklontong[id]
        }, timeout)
    ]
}
handler.help = ['caklontong']
handler.tags = ['game']
handler.command = /^caklontong$/i
handler.limit = false
handler.group = true

module.exports = handler