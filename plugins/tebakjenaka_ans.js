const similarity = require('similarity')
const threshold = 0.72

let handler = m => m
handler.before = async function (m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !(m.quoted.mtype == 'buttonsMessage') || !/TEBAK JENAKA/i.test(m.quoted.footerText)) return !0
    this.tebakjenaka = this.tebakjenaka ? this.tebakjenaka : {}
    if (!(id in this.tebakjenaka)) return m.reply('Soal itu telah berakhir')
    if (m.quoted.id == this.tebakjenaka[id][0].id) {
        let json = JSON.parse(JSON.stringify(this.tebakjenaka[id][1]))
        if (/(.hint|bantuan|^$)/i.test(m.text)) return !0
        if (m.text.toLowerCase() == json.result.answer.toLowerCase()) {
            global.db.data.users[m.sender].exp += this.tebakjenaka[id][2]
            this.sendButton(m.chat, `*Benar!*\n+${this.tebakjenaka[id][2]} XP`, '', 'Tebak Jenaka', '.tebakjenaka', m)
            clearTimeout(this.tebakjenaka[id][3])
            delete this.tebakjenaka[id]
        } else if (similarity(m.text.toLowerCase(), json.result.answer.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
        else m.reply(`*Salah!*`)
    }
    return !0
}
handler.exp = 0

module.exports = handler