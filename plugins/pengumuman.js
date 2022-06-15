const { MessageType } = require('@adiwajshing/baileys')

let handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }
  let users = participants.map(u => u.jid)
  let q = m.quoted ? m.quoted : m
  let c = m.quoted ? m.quoted : m.msg
  let msg = conn.cMod(
    m.chat,
    conn.prepareMessageFromContent(
      m.chat,
      {
        [c.toJSON ? q.mtype : MessageType.extendedText]: c.toJSON ? c.toJSON() : {
          text: c || ''
        }
      },
      {
        contextInfo: {
          mentionedJid: users
        },
        quoted: m
      }
    ),
    text || q.text
  )
  await conn.relayWAMessage(msg)
}
handler.help = ['pengumuman', 'hidetag'].map(v => v + ' <text/reply>')
handler.tags = ['group']
handler.command = /^(pengumuman|announce|hiddentag|hidetag)$/i

handler.group = true

module.exports = handler

