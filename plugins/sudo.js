const {
  proto,
  generateWAMessage,
  areJidsSameUser
} = require('@adiwajshing/baileys')

let handler = async (m, { conn, text }) => {
  if (!text) throw false
  let who
  if (m.isGroup) who = m.mentionedJid[0]
  else who = m.chat
  if (!who) throw 'Tag seseorang'
  let txt = text.replace('@' + who.split`@`[0], '').trimStart()

  let messages = await generateWAMessage(m.chat, { text: txt, mentions: m.mentionedJid }, {
    userJid: who,
    quoted: m.quoted && m.quoted.fakeObj
  })
  messages.key.fromMe = areJidsSameUser(who, conn.user.id)
  messages.key.id = m.key.id
  messages.pushName = m.name
  if (m.isGroup)
    messages.key.participant = messages.participant = who
  let msg = {
    messages: [proto.WebMessageInfo.fromObject(messages)].map(v => (v.conn = this, v)),
    type: 'append'
  }
  conn.ev.emit('messages.upsert', msg)
}
handler.command = /^sudo$/
handler.rowner = true

module.exports = handler
