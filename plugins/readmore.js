let handler = async (m, { conn, text }) => {
  let [l, r] = text.split`|`
  if (!l) l = ''
  if (!r) r = ''
  conn.reply(m.chat, l + conn.readmore + r, m)
}
handler.help = ['readmore <teks|teks2>']
handler.tags = ['maker']
handler.command = /^(spoiler|hidetext|readmore|selengkapnya)$/i

module.exports = handler
