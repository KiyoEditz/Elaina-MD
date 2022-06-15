const uploadImage = require('../lib/uploadImage')
let handler = async (m, { conn, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw `_Kirim/reply gambar dengan caption/teks_\n\nContoh:\n${usedPrefix + command}`
  let media = await q.download()
  let url = await uploadImage(media)
  await conn.sendFile(m.chat, global.API('xteam', '/videomaker/shaunthesheep', { url }, 'APIKEY'), 'shaunthesheep.mp4', 'jangan sedih yaa...', m)
}
handler.help = ['shaunthesheep']
handler.tags = ['maker']

handler.command = /^shaunthesheep$/i

module.exports = handler