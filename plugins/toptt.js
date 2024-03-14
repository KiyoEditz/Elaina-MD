const { toPTT } = require('../lib/converter')


let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
  if (!/video|audio/.test(mime)) throw `Reply audio yang ingin diubah ke voice note dengan caption *${usedPrefix + command}*`
  let media = await q.download()
  let audio = await toPTT(media, 'mp4')
  conn.sendFile(m.chat, audio.data, 'audio.mp3', '', m, true, { mimetype: 'audio/mp4', ephemeralExpiration: 86400 })
}
handler.help = ['tovn']
handler.tags = ['audio']

handler.command = /^to(vn)$/i

module.exports = handler
