const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
  let id = m.chat
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/TEBAK GAMBAR/i.test(m.quoted.text)) return !0
  this.tebakgambar = this.tebakgambar ? this.tebakgambar : {}
  if (!(id in this.tebakgambar)) return m.reply('Soal itu telah berakhir')
  //if (m.quoted.id == this.tebakgambar[id][0].id) {
  let json = JSON.parse(JSON.stringify(this.tebakgambar[id][1]))
  if (/(.hint|bantuan|^$)/i.test(m.text)) return !0
  if (m.text.toLowerCase() == json.jawaban.toLowerCase()) {
    global.db.data.users[m.sender].exp += this.tebakgambar[id][2]
    await this.reply(m.chat, `*Benar!*\n+${this.tebakgambar[id][2]} XP`, m)
    this.sendMessage(m.chat, { delete: this.tebakgambar[id][0].key }).catch(e => e)
    clearTimeout(this.tebakgambar[id][3])
    delete this.tebakgambar[id]
  } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
  else m.reply(`*Salah!*`)
  // }
  return !0
}
handler.exp = 0

module.exports = handler