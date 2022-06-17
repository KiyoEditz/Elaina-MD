let fs = require('fs')
let timeout = 60000
let poin = 500
let handler = async (m, { conn }) => {
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
Soal:
${json.pertanyaan}
Waktu jawab *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
`.trim()
    conn.tekateki[id] = [
        await conn.sendButton(m.chat, caption, '*TEKA TEKI*', 1, ['Bantuan', '.tete'], m),
        json, poin,
        setTimeout(() => {
            if (conn.tekateki[id]) conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, '', 1, ['Teka Teki', `.tekateki`], conn.tekateki[id][0])
            delete conn.tekateki[id]
        }, timeout)
    ]
}
handler.help = ['tekateki']
handler.tags = ['game']
handler.command = /^tekateki/i
handler.group = true

module.exports = handler