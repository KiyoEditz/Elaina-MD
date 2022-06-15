let handler = async (m, { conn, text }) => {
  let [teks, wm] = text.split('|')
  if (!teks) throw `Ketik ${usedPrefix + command} <teks|author(opt)>`
  await conn.sendFile(m.chat, global.API('lolhuman', '/api/quotemaker2', { text: teks, author: wm || db.data.users[m.sender].name }, 'apikey'), 'qmaker.jpg', 'Saat nya update story :/', m)

}
handler.help = ['quotemaker2 <teks|wm optional>']
handler.tags = ['maker']
handler.command = /^quotemaker2$/i
handler.limit = true
handler.register = true

module.exports = handler