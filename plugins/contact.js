let handler = async (m, { conn, text }) => {
  if (!text) return 'Masukan nama'
  let who
  if (m.isGroup) who = m.mentionedJid[0]
  else who = m.chat
  if (!who) throw '_Tag salah satu user_'
  let txt = text.replace('@' + who.split`@`[0], '').trimStart()
  return conn.sendContact(m.chat, who, txt || conn.getName(who, { withoutContact: true }), m)
}
handler.help = ['save'].map(v => v + ' @tag <nama>')
handler.tags = ['tools', 'group']

handler.command = /^save$/

module.exports = handler