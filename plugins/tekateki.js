let fs = require('fs')
let timeout = 60000
let poin = 500
let handler = async (m, { conn, usedPrefix }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {}
    let id = m.chat
    if (id in conn.tekateki) {
        if (conn.tekateki[id].length !== 0) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tekateki[id][0])
        delete conn.tekateki[id]
        throw false
    }
    conn.tekateki[id] = []
    let tekateki = JSON.parse(fs.readFileSync(`./src/scrap/tekateki.json`))
    let json = tekateki[Math.floor(Math.random() * tekateki.length)].data

    let caption = `
*TEKA TEKI*
Soal:
${json.pertanyaan}
Waktu jawab *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
Bantuan ${usedPrefix}tete
`.trim()
let msg = await conn.reply(m.chat, caption, m)
    conn.tekateki[id] = [
        msg,
        json, poin,
        setTimeout(() => {
            if (conn.tekateki[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tekateki[id][0])
            conn.sendMessage(m.chat, { delete: msg.key }).catch(e => e)
            delete conn.tekateki[id]
        }, timeout)
    ]
}
handler.help = ['tekateki']
handler.tags = ['game']
handler.command = /^tekateki/i
handler.group = true

module.exports = handler