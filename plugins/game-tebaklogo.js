let fs = require('fs')

let timeout = 120000
let poin = 600
let handler = async (m, {
    conn,
    command,
    usedPrefix
}) => {
    conn.tebaklogo = conn.tebaklogo ? conn.tebaklogo : {}
    let id = m.chat
    if (id in conn.tebaklogo) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaklogo[id][0])
        throw false
    }
    let src = JSON.parse(fs.readFileSync('./lib/tebaklogo.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `*${command.toUpperCase()}*
Logo apakah ini?

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik *${usedPrefix}hlog* untuk hint
Bonus: *${poin} XP*
    `.trim()
    conn.tebaklogo[id] = [
        await conn.sendFile(m.chat, json.img, '', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebaklogo[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebaklogo[id][0])
            delete conn.tebaklogo[id]
        }, timeout)
    ]
}
handler.help = ['tebaklogo']
handler.tags = ['game']
handler.game = true
handler.command = /^tebaklogo/i
//handelr.owner = true 
module.exports = handler

const buttons = [
    ['Hint', '/hlog'],
    ['Nyerah', 'menyerah']
]