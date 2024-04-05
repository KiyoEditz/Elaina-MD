const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
  let id = m.chat
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/「 Tebak Bendera 」/i.test(m.quoted.text)) return !0
  conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}
  if (!(id in conn.tebakbendera)) return m.reply('Soal itu telah berakhir')
  if (m.quoted.id == conn.tebakbendera[id][0].id) {
    /*let json = JSON.parse(JSON.stringify(conn.tebakbendera[id][1]))
    // m.reply(JSON.stringify(json, null, '\t'))
    if (m.text.toLowerCase() == json.jawaban.toLowerCase()) {
      global.DATABASE._data.users[m.sender].uang += conn.tebakbendera[id][2]
      m.reply(`*Benar!*\n+Rp${conn.tebakbendera[id][2]}`)
      clearTimeout(conn.tebakbendera[id][3])
      delete conn.tebakbendera[id]
    } else if (m.text.toLowerCase().endsWith(json.jawaban.split` `[1])) m.reply(`*Dikit Lagi!*`)
    else m.reply(`*Salah!*`)
  }
  return !0
}*/
let json = JSON.parse(JSON.stringify(this.tebakbendera[id][1]))
        // m.reply(JSON.stringify(json, null, '\t'))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().replace(' ', '')) {
            global.db.data.users[m.sender].exp += this.tebakbendera[id][2]
            this.reply(m.chat, `*Benar!*\n+${this.tebakbendera[id][2]} XP`, m)
            this.sendMessage(m.chat, { delete: this.tebakbendera[id][0].key }).catch(e => e)
            clearTimeout(this.tebakbendera[id][3])
            delete this.tebakbendera[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
        else m.reply(`*Salah!*`)
    }
    return !0
}
handler.exp = 0

module.exports = handler