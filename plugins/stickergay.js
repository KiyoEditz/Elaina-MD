const uploadImage = require('../lib/uploadImage')
const { sticker } = require('../lib/sticker')

let { webp2png } = require('../lib/webp2mp4')
let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!(mime || /image\/(jpe?g|png)|webp/.test(mime))) throw `_Kirim/reply gambar dengan caption/teks_\n\nContoh:\n${usedPrefix + command}`
    let img = await q.download()
    let url
    if (/webp/.test(mime)) {
      url = await webp2png(img)
    } else {
      url = await uploadImage(img)
    }
    let wasted = `https://some-random-api.ml/canvas/gay?avatar=${url}`
    let stiker = await sticker(null, wasted, 'LGBT -_-', global.author)
    conn.sendFile(m.chat, stiker, 'sgay.webp', '', m)
  } catch (e) {
    throw '_Error.._'
  }
}
handler.help = ['stikergay (caption|reply gambar)']
handler.tags = ['stickerother']
handler.command = /^sgay$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler