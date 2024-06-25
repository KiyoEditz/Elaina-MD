let fs = require('fs')
let timeout = 120000
let poin = 700
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakmakan = conn.tebakmakan ? conn.tebakmakan: {}
    let id = 'tebakmakanan-' + m.chat
    if (id in conn.tebakmakan) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakmakan[id][0])
    let src = JSON.parse(fs.readFileSync('./lib/tebakmakanan.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
Silahkan Tebak Makanan Di Atas...

${json.deskripsi}

Timeout ${(timeout / 1000).toFixed(2)} detik
Ketik *${usedPrefix}temak* untuk bantuan
Bonus: *${poin} XP*
`.trim()
    conn.tebakmakan[id] = [
        await conn.sendFile(m.chat, json.img, 'tebakbendera.jpg', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakmakan[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakmakan[id][0])
            delete conn.tebakmakan[id]
        }, timeout)
    ]
}
handler.help = ['tebakmakanan']
handler.tags = ['game']
handler.command = /^tebakmakanan$/i

handler.group = true
handler.game = true

module.exports = handler