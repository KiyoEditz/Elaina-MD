const { sticker } = require('../lib/sticker')
const uploadFile = require('../lib/uploadFile')
const uploadImage = require('../lib/uploadImage')
let { webp2png } = require('../lib/webp2mp4')
let handler = async (m, { conn, text, usedPrefix }) => {
  let stiker = false
  try {
    let [packname, ...author] = text.split`|`
    author = (author || []).join`|`
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) throw `_Reply stiker dengan teks_\n\nContoh:\n${usedPrefix + command} packname|author (Premium)`
    if (/webp/.test(mime)) {
      let img = await q.download()
      let out = await webp2png(img)
      stiker = await sticker(0, out, packname || '', author || '')
    } else if (/image/.test(mime)) {
      let img = await q.download()
      let link = await uploadImage(img)
      stiker = await sticker(0, link, packname || '', author || '')
    } else if (/video/.test(mime)) {
      if ((q.msg || q).seconds > 11) throw 'Maksimal 10 detik!'
      let img = await q.download()
      let link = await uploadFile(img)
      stiker = await sticker(0, link, packname || '', author || '')
    }
  } finally {
    if (stiker) conn.sendFile(m.chat, stiker, 'colongan.webp', '', m).catch(e => e)
  }
}
handler.help = ['wm <packname|author>']
handler.tags = ['stickerprems', 'premium']
handler.command = /^wm$/i
handler.limit = true

module.exports = handler