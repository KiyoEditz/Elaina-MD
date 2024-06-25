let similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function(m) {
    let id = 'tebaklagu-' + m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/Ketik.*hlagu/i.test(m.quoted.text) || /.*hlagu/i.test(m.text))
        return !0
    this.game = this.game ? this.game : {}
    if (!(id in this.game))
        return m.reply('Soal itu telah berakhir')
    if (m.quoted.id == this.game[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(this.game[id][3])
            delete this.game[id]
            return m.reply('Yah Menyerah :( !')
        }
        let json = JSON.parse(JSON.stringify(this.game[id][1]))
        // m.reply(JSON.stringify(json, null, '\t'))
        if (m.text.toLowerCase() == json.judul.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.game[id][2]
            global.db.data.users[m.sender].limit += 1
            // benar
conn.sendFile(m.chat, './src/media/image/true.webp', m, { packname: packname, author: author })
      setTimeout(() => {
      conn.reply(m.chat, `*+ 600 exp*`, m)
}, 3000)
            clearTimeout(this.game[id][3])
            delete this.game[id]
        } else if (similarity(m.text.toLowerCase(), json.judul.toLowerCase().trim()) >= threshold)
            m.reply(`*💢Dikit Lagi!*`)
        else
            // salah
conn.sendFile(m.chat, './src/media/image/false.webp', m, { packname: packname, author: author })
    }
    return !0
}
handler.exp = 0

module.exports = handler