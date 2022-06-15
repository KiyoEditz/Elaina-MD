let handler = async (m, { conn, usedPrefix, text }) => {
    if (!m.fromMe) throw `Gabisa, hanya bisa digunakan oleh jadibot`
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false
    if (!who) throw `Masukkan nomor yang akan dijadikan owner\n\nContoh:\n${usedPrefix}setowner ${m.sender.split`@`[0]}`
    global.db.data.settings[conn.user.jid].owner = who
    m.reply('Berhasil')
}
handler.help = ['setowner']
handler.tags = ['jadibot']
handler.command = /^(setowner)$/i
handler.owner = true
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler