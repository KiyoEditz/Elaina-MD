let { MessageType } = require('@adiwajshing/baileys')

let handler = async (m, { conn, text }) => {
  if (!text) text = m.text
  conn.sendMessage(m.chat, text, MessageType.extendedText)
}
handler.help = ['say <teks>']
handler.tags = ['fun']
handler.command = /^(say|katakan)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
