const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

let handler = async (m, { conn }) => {
  if (!m.quoted) throw 'Reply gambar/video yang ingin Anda lihat'
  if (!/viewOnce(MessageV2)?/.test(m.quoted.mtype)&&!m.quoted?.viewOnce) throw 'Ini bukan pesan view-once.'
  let msg = m.quoted;
  let type = msg.mtype
  let media = await downloadContentFromMessage(m.quoted, m.quoted.mtype == 'imageMessage' ? 'image' : 'video')
  let buffer = Buffer.from([])
  for await (const chunk of media) {
    buffer = Buffer.concat([buffer, chunk])
  }
buffer
  if (/video/.test(type)) {
    return conn.sendFile(m.chat, buffer, 'media.mp4', msg.text || '', m)
  } else if (/image/.test(type)) {
    return conn.sendFile(m.chat, buffer, 'media.jpg', msg.text || '', m)
  } else if (/audio/.test(type)) {
    return conn.sendFile(m.chat, buffer, 'media.mp3', msg.text || '', m)
  }
}

handler.help = ['readvo']
handler.tags = ['info']
handler.command = ['readviewonce', 'read', 'liat', 'readvo', 'rvo'] 

module.exports = handler