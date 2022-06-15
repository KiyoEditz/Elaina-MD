let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, 'Silahkan masukkan requestmu', m)
    conn.fakeReply(global.owner[0] + '@s.whatsapp.net', `*[REQUEST]*\nPesan : ${text}`, m.sender, m.text, m.chat)
    conn.reply(m.chat, '_Berhasil Request Fitur ke Owner Bot_', m)
}
handler.help = ['request']
handler.tags = ['main']
handler.command = /^req(uest?)?$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler