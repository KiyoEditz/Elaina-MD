const { toAudio } = require('../lib/converter')

let handler = async (m, { conn, usedPrefix, command, text }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
  if (!/video|audio/.test(mime)) throw `Reply video atau voice note yang ingin diubah ke mp3 dengan caption *${usedPrefix + command}*`
  let media = await q.download()
  let audio = await toAudio(media, 'mp4')
  conn.sendFile(m.chat, audio.data, (text ? text : 'audio') + '.mp3', `Succes`, m, false, {
    asDocument: db.data.users[m.sender].useDocument, mimetype: 'audio/mpeg'
  })
  if (!text) m.reply(`
Btw... Kamu juga bisa menamai dengan judul sendiri lohh
Ketik *${usedPrefix + command}* judulnya

contoh
${usedPrefix + command} to the bone 
`.trim())
}
handler.help = ['tomp3']
handler.tags = ['audio']

handler.command = /^to(mp3|a(udio)?)$/i

module.exports = handler
