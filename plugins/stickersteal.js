const { createExif, modStick } = require("../lib/exif")
const uploadFile = require('../lib/uploadFile')
const uploadImage = require('../lib/uploadImage')
let { webp2png } = require('../lib/webp2mp4')
let handler = async (m, { conn, args }) => {
  let sender = global.db.data.users[m.sender].registered ? global.db.data.users[m.sender].name : m.name
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  let media = await q.download()
  let link
  if (/webp/.test(mime)) {
    link = await webp2png(media)
  } else {
    link = await uploadImage(media).catch(e => uploadFile(media))
  }
  let anu = args.join(' ').split('|')
  console.log(anu)
  let satu = anu[0] !== '' ? anu[0] : global.packname
  let dua = typeof anu[1] !== 'undefined' ? anu[1] : sender
  createExif(satu, dua)
  modStick(link, conn, m, m.chat)
}
handler.help = ['steal', 'sticker'].map(v => v + ' <packname|author>')
handler.tags = ['stickerprems', 'premium']
handler.command = /^(steal|ambil|colong)$/i
handler.premium = true
handler.fail = null
handler.limit = false

module.exports = handler