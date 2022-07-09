let handler = async (m, { conn, isOwner, isAdmin }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }
  let users = m.mentionedJid
  conn.groupParticipantsUpdate(
    m.chat,
    users,
    "promote" // replace this parameter with "remove", "demote" or "promote"
  )
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

