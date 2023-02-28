let handler = m => m

handler.before = async function (m, { conn, match }) {
    // if (match) return !1
    if (!m.chat.endsWith('@s.whatsapp.net')) return !0
    if (!global.db.data.settings[conn.user.jid].anonymous) return m.reply('Fitur ini dinonaktifkan karena spam')
    this.anonymous = this.anonymous ? this.anonymous : db.data.sessions[this.user.jid].anonymous
    let room = Object.values(this.anonymous).find(room => [room.a, room.b].includes(m.sender) && room.state === 'CHATTING')
    if (room) {
        let other = [room.a, room.b].find(user => user !== m.sender)
        m.copyNForward(other, true, m.quoted && m.quoted.fromMe ? {
            contextInfo: {
                ...m.msg.contextInfo,
                forwardingScore: 1,
                isForwarded: true,
                participant: other
            }
        } : {})
        db.data.sessions[this.user.jid].anonymous = this.anonymous
    }
    return !0
}

module.exports = handler