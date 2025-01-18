const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
  let id = m.chat
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/tghint/i.test(m.quoted.caption)) return !0
  this.tebakgame = this.tebakgame ? this.tebakgame : {}
  if (!(id in this.tebakgame)) return m.reply('Soal itu telah berakhir')
  if (m.quoted.id == this.tebakgame[id][0].id) {
    let json = JSON.parse(JSON.stringify(this.tebakgame[id][1]))
    // m.reply(JSON.stringify(json, null, '\t'))
    if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
      global.db.data.users[m.sender].exp += this.tebakgame[id][2]
      global.db.data.users[m.sender].limit += 1

      //global.db.data.users[m.sender].money += 100000
      global.db.data.users[m.sender].exp += 1000
            // benar
conn.sendFile(m.chat, './src/media/image/true.webp', m, { packname: packname, author: author })
      setTimeout(() => {
      conn.reply(m.chat, `*+1.000 exp*`, m)
}, 3000)
      clearTimeout(this.tebakgame[id][3])
      delete this.tebakgame[id]
    } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
    else // salah
conn.sendFile(m.chat, './src/media/image/false.webp', m, { packname: packname, author: author })
//conn.reply(m.chat, `*Salah!*`, m)
  }
  return !0
}
handler.exp = 0

module.exports = handler