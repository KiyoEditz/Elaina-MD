const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/SIAPA AKU/i.test(m.quoted.footerText)) return !0
    this.siapaaku = this.siapaaku ? this.siapaaku : {}
    if (!(id in this.siapaaku)) return m.reply('Soal itu telah berakhir')
    if (m.quoted.id == this.siapaaku[id][0].id) {
        let json = JSON.parse(JSON.stringify(this.siapaaku[id][1]))
        if (/(.siapa|bantuan|^$)/i.test(m.text)) return !0
        if (m.text.toLowerCase() == json.result.answer.toLowerCase()) {
            global.db.data.users[m.sender].exp += this.siapaaku[id][2]
            this.sendButton(m.chat, `*Benar!*\n+${this.siapaaku[id][2]} XP`, '', 1, ['Siapa Aku', '.siapaaku'], m)
            clearTimeout(this.siapaaku[id][3])
            delete this.siapaaku[id]
        } else if (similarity(m.text.toLowerCase(), json.result.answer.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
        else m.reply(`*Salah!*`)
    }
    return !0
}
handler.exp = 0

module.exports = handler