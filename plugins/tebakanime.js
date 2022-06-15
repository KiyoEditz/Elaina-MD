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

    conn.scrapGame(global.API('lolhuman', '/api/tebakchara', '', 'apikey'), 'tebakanime').catch(e => e)

    let caption = `
Siapa nama Character ini?

Waktu Jawab: *${(timeout / 1000).toFixed(2)} detik*
Bonus: ${poin} XP
*Reply pesan ini untuk menjawab!*
    `.trim()
    conn.tebakanime[id] = [
      await conn.sendButtonImg(m.chat, json.result.image, caption, '*TEBAK ANIME*\nBantuan mengurangi 1 limit', 'Bantuan', '.hintanime', m),
      json, poin,
      setTimeout(() => {
        if (conn.tebakanime[id]) conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.name}*`, '', 'Tebak Anime', `.tebakanime`, conn.tebakanime[id][0])
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