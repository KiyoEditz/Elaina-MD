const { sticker } = require("../lib/sticker")
const uploadFile = require('../lib/uploadFile')
const uploadImage = require('../lib/uploadImage')
let { webp2png } = require('../lib/webp2mp4')
let handler = async (m, { conn, args, usedPrefix, command }) => {
  let sender = global.db.data.users[m.sender].registered ? global.db.data.users[m.sender].name : m.name
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!(mime || /image\/(jpe?g|png)|webp/.test(mime))) throw `_Reply sticker dengan teks_\n\nContoh:\n${usedPrefix + command} Milik | Syahrul`
  let media = await q.download()
  let link
  if (/webp/.test(mime)) {
    link = await webp2png(media)
  } else {
    link = await uploadImage(media).catch(e => uploadFile(media))
  }
  let anu = args.join(' ').split('|')
  let satu = anu[0] !== '' ? anu[0] : global.packname
  let dua = typeof anu[1] !== 'undefined' ? anu[1] : sender
  let stiker = await sticker(null, link, satu, dua)
  conn.sendFile(m.chat, stiker, 'colongan.webp', '', m)
}
handler.help = ['steal', 'sticker'].map(v => v + ' <packname|author>')
handler.tags = ['stickerprems', 'premium']
handler.command = /^(steal|ambil|colong)$/i
handler.premium = true
handler.fail = null
handler.limit = false

module.exports = handler