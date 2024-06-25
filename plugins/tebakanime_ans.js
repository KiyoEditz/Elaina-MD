const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
  let id = m.chat
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/Ketik.*hnime/i.test(m.quoted.text)) return !0
  this.tebakanime = this.tebakanime ? this.tebakanime : {}
  if (!(id in this.tebakanime)) return m.reply('Soal itu telah berakhir')
  if (m.quoted.id == this.tebakanime[id][0].id) {
    let json = JSON.parse(JSON.stringify(this.tebakanime[id][1]))
    // m.reply(JSON.stringify(json, null, '\t'))
    if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
      global.db.data.users[m.sender].exp += this.tebakanime[id][2]
      global.db.data.users[m.sender].limit += 1
      global.db.data.users[m.sender].exp += 500
            // benar
conn.sendfile(m.chat, './src/media/image/true.webp', m, { packname: packname, author: author })
      setTimeout(() => {
      conn.reply(m.chat, `*+ 500 exp*`, m)
}, 3000)
      clearTimeout(this.tebakanime[id][3])
      delete this.tebakanime[id]
    } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
    else // salah
conn.sendFile(m.chat, './src/media/image/false.webp', m, { packname: packname, author: author })
  }
  return !0
}
handler.exp = 0

module.exports = handler