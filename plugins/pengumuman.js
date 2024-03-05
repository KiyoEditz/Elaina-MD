const { generateWAMessageFromContent } = require('@whiskeysockets/baileys')

let handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }
  let users = participants.map(u => conn.decodeJid(u.id))
  let q = m.quoted ? m.quoted : m
  let c = m.quoted ? m.quoted : m.msg
  const msg = await conn.cMod(m.chat,
    generateWAMessageFromContent(m.chat, {
      [c.toJSON ? q.mtype : 'extendedTextMessage']: c.toJSON ? c.toJSON() : {
        text: c || ''
      }
    }, {
      quoted: m,
      userJid: conn.user.id
    }),
    text || q.text, conn.user.jid, { mentions: users }
  )
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}
handler.help = ['pengumuman', 'hidetag'].map(v => v + ' <text/reply>')
handler.tags = ['group']
handler.command = /^(pengumuman|announce|hiddentag|hidetag)$/i

handler.group = true

module.exports = handler

