let handler = async (m, { conn, text }) => {
  if (!text) throw false
  let who
  if (m.isGroup) who = m.mentionedJid[0]
  else who = m.chat
  if (!who) throw 'Tag seseorang'
  let txt = text.replace('@' + who.split`@`[0], '').trimStart()
  let msg = await conn.preSudo(txt, who, m)
  conn.ev.emit('messages.upsert', msg)
}
handler.command = /^sudo$/
handler.rowner = true

module.exports = handler
