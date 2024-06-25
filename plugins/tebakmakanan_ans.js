let similarity = require('similarity')
const threshold = 0.72

let handler = m => m
handler.before = async function(m) {
    let id = 'tebakmakanan-' + m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/Ketik.*temak/i.test(m.quoted.text) || /.*temak/i.test(m.text))
        return !0
    this.tebakmakan = this.tebakmakan ? this.tebakmakan : {}
    if (!(id in this.tebakmakan))
        return m.reply('Soal itu telah berakhir')
    if (m.quoted.id == this.tebakmakan[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(this.tebakmakan[id][3])
            delete this.tebakmakan[id]
            return m.reply('Yah Menyerah :( !')
        }
        let json = JSON.parse(JSON.stringify(this.tebakmakan[id][1]))
        //m.reply(JSON.stringify(json, null, '\t'))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.tebakmakan[id][2]

global.db.data.users[m.sender].limit += 1
            global.db.data.users[m.sender].exp += 700
            // benar
conn.sendFile(m.chat, './src/media/image/true.webp', m, { packname: packname, author: author })
      setTimeout(() => {
      conn.reply(m.chat, `*+ 700 exp*`, m)
}, 3000)
            clearTimeout(this.tebakmakan[id][3])
            delete this.tebakmakan[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold)
            m.reply(`*Dikit Lagi!*`)
        else
            // salah
conn.sendFile(m.chat, './src/media/image/false.webp', m, { packname: packname, author: author })
    }
    return !0
}
handler.exp = 0

module.exports = handler