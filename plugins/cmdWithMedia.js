module.exports = {
    async all(m, chatUpdate) {
        if (m.isBaileys) return
        if (!m.message) return
        if (!m.msg.fileSha256) return
        if (!(Buffer.from(m.msg.fileSha256).toString('hex') in global.db.data.sticker)) return
        let hash = global.db.data.sticker[Buffer.from(m.msg.fileSha256).toString('hex')]
        let { text, mentionedJid } = hash
        let msg = await this.preSudo(text, m.sender, m, chatUpdate)
        this.ev.emit('messages.upsert', msg)

    }
}