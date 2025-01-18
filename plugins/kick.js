let handler = async (m, { conn, args, isOwner, isAdmin }) => {
  let ownerGroup = m.chat.split`-`[0] + '@s.whatsapp.net'
  let users = m.mentionedJid ? m.mentionedJid.filter(u => !(u == ownerGroup || u.includes(conn.user.jid))) : m.quoted.sender
  if (!users) throw `Tag atau reply orang nya`
  for (let user of users) if (user.endsWith('@s.whatsapp.net')) await conn.groupParticipantsUpdate(
    m.chat,
    users,
    "remove" // replace this parameter with "remove", "demote" or "promote"
  )
}
handler.help = ['kick @user / reply']
handler.tags = ['admin']
handler.command = /^(kick|\-)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false
handler.admin = true 
handler.botAdmin = true
handler.limit = true

module.exports = handler