let fs = require('fs')
let timeout = 60000
let poin = 500
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakjenaka = conn.tebakjenaka ? conn.tebakjenaka : {}
    let id = m.chat
    if (id in conn.tebakjenaka) {
        if (conn.tebakjenaka[id].length !== 0) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakjenaka[id][0])
        delete conn.tebakjenaka[id]
        throw false
    }
    conn.tebakjenaka[id] = []
    let src = JSON.parse(fs.readFileSync(`./src/scrap/tebakjenaka.json`))
    let json = src[Math.floor(Math.random() * src.length)]
    //  conn.scrapGame(global.API('lolhuman', '/api/tebak/jenaka', '', 'apikey'), 'tebakjenaka').catch(e => e)

    let question = json.result.question
    let answer = json.result.answer
    let caption = `
Soal: ${question}

Waktu Jawab: *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
*Reply pesan ini untuk menjawab!*
Bantuan mengurangi 1 limit
${usedPrefix}hintjenaka`.trim()
    let btn = await conn.reply(m.chat, caption, m)
    conn.tebakjenaka[id] = [
        btn,
        json, poin,
        setTimeout(() => {
            if (conn.tebakjenaka[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${answer}*`, conn.tebakjenaka[id][0])
            conn.sendMessage(m.chat, { delete: btn.key }).catch(e => e)
            delete conn.tebakjenaka[id]
        }, timeout)
    ]
}
handler.help = ['tebakjenaka']
handler.tags = ['game']
handler.command = /^tebakjenaka$/i
handler.limit = false
handler.group = true
module.exports = handler