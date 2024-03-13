let fs = require('fs')
let timeout = 60000
let poin = 400
let handler = async (m, { conn, usedPrefix }) => {
    conn.susunkata = conn.susunkata ? conn.susunkata : {}
    let id = m.chat
    if (id in conn.susunkata) {
        if (conn.susunkata[id].length !== 0) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.susunkata[id][0])
        delete conn.susunkata[id]
        throw false
    }
    conn.susunkata[id] = []
    let src = JSON.parse(fs.readFileSync(`./src/scrap/susunkata.json`))
    let json = src[Math.floor(Math.random() * src.length)]

    //conn.scrapGame(global.API('lolhuman', '/api/tebak/susunkata', '', 'apikey'), 'susunkata').catch(e => e)

    let question = json.result.pertanyaan
    let caption = `
*Urutkan kata:* ${question}

Waktu Jawab: *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
*Reply untuk menjawab!*
`.trim()
    conn.susunkata[id] = [
        await m.reply(caption),
        json, poin,
        setTimeout(() => {
            if (conn.susunkata[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.jawaban}*`, conn.susunkata[id][0])
            delete conn.susunkata[id]
        }, timeout)
    ]
}
handler.help = ['susunkata']
handler.tags = ['game']
handler.command = /^susunkata$/i
handler.group = true
handler.limit = false
module.exports = handler