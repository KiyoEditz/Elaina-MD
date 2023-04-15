let handler = m => m

handler.all = async function (m) {
    // if (!db.data.settings[this.user.jid].antispam) return // antispam aktif?
    if (m.isBaileys) return
    if (m.fromMe) return
    // if (!m.message) return
    //if (!m.isCommand) return
    if (db.data.users[m.sender].banned) return
    if (db.data.chats[m.chat].isBanned) return
    this.spam = this.spam ? this.spam : {}
    if (m.sender in this.spam) {
        this.spam[m.sender].count++
        if (m.messageTimestamp.toNumber() - this.spam[m.sender].lastspam > 10) {
            if (this.spam[m.sender].count > 5) {
                m.reply(`Tolong @${m.sender.split('@')[0]} untuk tidak spam`, m.chat, { contextInfo: { mentionedJid: [m.sender] } })
            } else if (this.spam[m.sender].count > 10) {
                db.data.users[m.sender].banned = true
                await this.reply(m.chat, `_*Kamu sekarang dibanned/diblokir!*_ Karena kamu Spam\nHubungi Owner untuk membuka banned`, m)
            }
            this.spam[m.sender].count = 0
            this.spam[m.sender].lastspam = m.messageTimestamp.toNumber()
        }
    }
    else this.spam[m.sender] = {
        jid: m.sender,
        count: 0,
        lastspam: 0
    }
}

module.exports = handler
