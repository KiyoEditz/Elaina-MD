let fs = require('fs')
let fetch = require('node-fetch')
let timeout = 60000
let poin = 500
let handler = async (m, { conn, usedPrefix }) => {
  try {
    conn.tebakanime = conn.tebakanime ? conn.tebakanime : {}
    let id = m.chat
    if (id in conn.tebakanime) {
      if (conn.tebakanime[id].length !== 0) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakanime[id][0])
      delete conn.tebakanime[id]
      throw false
    }
    conn.tebakanime[id] = []
    let src = JSON.parse(fs.readFileSync(`./src/scrap/tebakanime.json`))
    let json = src[Math.floor(Math.random() * src.length)]

    // conn.scrapGame(global.API('lolhuman', '/api/tebakchara', '', 'apikey'), 'tebakanime').catch(e => e)

    let caption = `
Siapa nama Character ini?

Waktu Jawab: *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
*Reply pesan ini untuk menjawab!*
Bantuan mengurangi 1 limi
${usedPrefix}hintanime
    `.trim()
    let msg = await conn.sendFile(m.chat, json.result.image, 'tebak.jpg', caption, m)
     
    conn.tebakanime[id] = [
      msg, json, poin,
      setTimeout(() => {
        if (conn.tebakanime[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.name}*`, conn.tebakanime[id][0])
        conn.sendMessage(m.chat, { delete: msg.key }).catch(e => e)
    
        delete conn.tebakanime[id]
      }, timeout)
    ]
  } catch (e) {
    throw e //'Error, Fitur dalam perbaikan'
  }
}
handler.help = ['tebakanime']
handler.tags = ['game']
handler.command = /^tebakanime/i
handler.group = true
module.exports = handler