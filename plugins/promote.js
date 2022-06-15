let handler = async (m, { conn, args, isOwner, isAdmin }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }
  let users = m.mentionedJid
  conn.groupMakeAdmin(m.chat, users)
}
handler.help = ['promote @user']
handler.tags = ['admin']
handler.command = /^(promote|admin|\^|↑)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false
handler.botAdmin = true

handler.fail = null

module.exports = handler

