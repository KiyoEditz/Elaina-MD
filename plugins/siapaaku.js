let fs = require('fs')
let timeout = 60000
let poin = 400
let handler = async (m, { conn, usedPrefix }) => {
    conn.siapaaku = conn.siapaaku ? conn.siapaaku : {}
    let id = m.chat
    if (id in conn.siapaaku) {
        if (conn.siapaaku[id].length !== 0) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.siapaaku[id][0])
        delete conn.siapaaku[id]
        throw false
    }
    conn.siapaaku[id] = []
    let src = JSON.parse(fs.readFileSync(`./src/scrap/siapaaku.json`))
    let json = src[Math.floor(Math.random() * src.length)]
    // conn.scrapGame(global.API('lolhuman', '/api/tebak/siapaaku', '', 'apikey'), 'siapaaku').catch(e => e)
    let question = json.result.question
    let caption = `
*Soal:* ${question}

Waktu Jawab: *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
*Reply pesan ini untuk menjawab!*
Bantuan mengurangi 1 limit
${usedPrefix}siapasih`.trim()

    let btn = await conn.reply(m.chat, caption, m)
    conn.siapaaku[id] = [
        btn,
        json, poin,
        setTimeout(() => {
            if (conn.siapaaku[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.answer}*`, conn.siapaaku[id][0])
            conn.sendMessage(m.chat, { delete: btn.key }).catch(e => e)
            delete conn.siapaaku[id]
        }, timeout)
    ]
}
handler.help = ['siapaaku']
handler.tags = ['game']
handler.command = /^siapaaku$/i
handler.limit = false
handler.group = true
module.exports = handler