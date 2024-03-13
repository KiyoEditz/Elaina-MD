const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/siapasih/i.test(m.quoted.text)) return !0
    this.siapaaku = this.siapaaku ? this.siapaaku : {}
    if (!(id in this.siapaaku)) return m.reply('Soal itu telah berakhir')
    if (m.quoted.id == this.siapaaku[id][0].id) {
        let json = JSON.parse(JSON.stringify(this.siapaaku[id][1]))
        if (/(.siapa|bantuan|^$)/i.test(m.text)) return !0
        if (m.text.toLowerCase() == json.result.answer.toLowerCase()) {
            global.db.data.users[m.sender].exp += this.siapaaku[id][2]
            this.reply(m.chat, `*Benar!*\n+${this.siapaaku[id][2]} XP`, m)
            this.sendMessage(m.chat, { delete: this.siapaaku[id][0].key }).catch(e => e)
            clearTimeout(this.siapaaku[id][3])
            delete this.siapaaku[id]
        } else if (similarity(m.text.toLowerCase(), json.result.answer.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
        else m.reply(`*Salah!*`)
    }
    return !0
}
handler.exp = 0

module.exports = handler