const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/ASAH OTAK/i.test(m.quoted.footerText)) return !0
    this.asahotak = this.asahotak ? this.asahotak : {}
    if (!(id in this.asahotak)) return m.reply('Soal itu telah berakhir')
    if (m.quoted.id == this.asahotak[id][0].id) {
        let json = JSON.parse(JSON.stringify(this.asahotak[id][1]))
        if (/(.hint|bantuan|^$)/i.test(m.text)) return !0
        if (m.text.toLowerCase() == json.result.jawaban.toLowerCase().replace(' ', '')) {
            global.db.data.users[m.sender].exp += this.asahotak[id][2]
            this.reply(m.chat, `*Benar!*\n+${this.asahotak[id][2]} XP`, m)
            clearTimeout(this.asahotak[id][3])
            delete this.asahotak[id]
        } else if (similarity(m.text.toLowerCase(), json.result.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)

        else m.reply(`*Salah!*`)
    }
    return !0
}
handler.exp = 0

module.exports = handler