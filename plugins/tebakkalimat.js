let fs = require('fs')
let timeout = 30000
let poin = 2400
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakkalimat = conn.tebakkalimat ? conn.tebakkalimat : {}
    let id = m.chat
    if (id in conn.tebakkalimat) {
        if (conn.tebakkalimat[id].length !== 0) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkalimat[id][0])
        delete conn.tebakkalimat[id]
        throw false
    }
    conn.tebakkalimat[id] = []
    let src = JSON.parse(fs.readFileSync(`./src/scrap/tebakkalimat.json`))
    let json = src[Math.floor(Math.random() * src.length)]
    let question = json.soal
    let caption = `
*TEBAK KALIMAT*
${question}

Waktu Jawab: *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
*Reply pesan ini untuk menjawab!*`.trim()
let msg = await m.reply(caption)
    conn.tebakkalimat[id] = [
        msg,
        json, poin,
        setTimeout(() => {
            if (conn.tebakkalimat[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakkalimat[id][0])
            conn.sendMessage(m.chat, { delete: msg.key }).catch(e => e)
            delete conn.tebakkalimat[id]
        }, timeout)
    ]
}
handler.help = ['tebakkalimat']
handler.tags = ['game']
handler.command = /^tebakkalimat$/i
handler.group = true
handler.limit = false
module.exports = handler