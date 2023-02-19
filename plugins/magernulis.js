let handler = async (m, { conn, text }) => {
  await conn.sendFile(m.chat, global.API('lolhuman', '/api/nulis', { text }, 'apikey'), 'nulis.jpg', 'Nahhh sudah jadi..', m)
}
handler.help = ['nulis <teks>']
handler.tags = ['maker']
handler.command = /^((mager)?nulis)$/i
handler.disabled = 1
module.exports = handler