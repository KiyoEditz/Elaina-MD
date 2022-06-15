const { MessageType } = require('@adiwajshing/baileys')
const { sticker } = require('../lib/sticker')
let handler = async (m, { conn, args, usedPrefix }) => {
  let stiker = false
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (/image|video/.test(mime)) {
    throw `Fitur ini hanya untuk stiker via url/link\nGunakan *${usedPrefix}stiker*`
  }
  stiker = await sticker(false, args[0], global.packname, global.author)
  conn.sendMessage(m.chat, stiker, MessageType.sticker, {
    quoted: m
  })
}
handler.help = ['stiker2 <link>']
handler.tags = ['sticker']
handler.command = /^s(tic?ker)?2$/i

module.exports = handler
