let handler = async (m, { conn, args, usedPrefix }) => {
  let res = await conn.groupRevokeInvite(m.chat)
  m.reply('_Link Group Berhasil Direset_\n\nSilahkan buka PC Bot')
  conn.reply(m.sender, `https://chat.whatsapp.com/${res.code}`, m)
}
handler.help = ['revoke (reset link group)']
handler.tags = ['admin']
handler.command = /^re(voke|new)(invite|link)?$/i
handler.group = true

handler.admin = true
handler.botAdmin = true

module.exports = handler
