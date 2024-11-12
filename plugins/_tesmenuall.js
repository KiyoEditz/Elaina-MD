let handler = async (m, { conn, usedPrefix, command, text }) => {
  conn.reply(m.chat, `_*yahaha goblok banget*_`, m);
}
handler.help = ['menuall']
handler.tags = ['main']
handler.command = /^(menuall)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler