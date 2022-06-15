let handler = async (m, { conn, text }) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? (text.replace(/[^0-9]/g, '')) + '@s.whatsapp.net' : false
    else who = text ? (text.replace(/[^0-9]/g, '')) + '@s.whatsapp.net' : m.chat
    if (!who) throw 'Tag salah satu orang'
    let users = global.db.data.users
    if (users[who].banned == false) throw `_Nomor ${m.isGroup ? 'itu' : 'ini'} aman_`
    users[who].banned = false
    conn.reply(m.chat, `_*Berhasil unban*_\nBot akan merespon nomor tersebut`, m)
}
handler.help = ['unban']
handler.tags = ['owner']
handler.command = /^unban$/i
handler.owner = true

module.exports = handler