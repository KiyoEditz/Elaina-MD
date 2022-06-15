let handler = async (m, { conn, text }) => {
  if (!text) throw '_Masukkan teks bernomor yang berawalan @_'
  m.reply(text, false, {
    contextInfo: {
      mentionedJid: conn.parseMention(text)
    }
  })
}
handler.help = ['mention @nomorWhatsapp']
handler.tags = ['tools']

handler.command = /^(mention|reply)$/i

module.exports = handler
