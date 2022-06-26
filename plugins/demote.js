let handler = async (m, { conn, args, usedPrefix, isAdmin, isOwner, participants }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }
  let members = participants.filter(member => member.isAdmin).map(member => member.jid)
  let users = m.mentionedJid.filter(user => members.includes(user))
  if (!users) throw `_Tag adminnya_\n\nContoh\n${usedPrefix}demote @tag`
  await conn.groupParticipantsUpdate(
    m.chat,
    users,
    "demote" // replace this parameter with "remove", "demote" or "promote"
  )
}
handler.help = ['demote @user']
handler.tags = ['admin']
handler.command = /^(demote|member|↓)$/i
handler.group = true
handler.botAdmin = true

module.exports = handler

