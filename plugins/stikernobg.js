const uploadImage = require('../lib/uploadImage')
let { webp2png } = require('../lib/webp2mp4')
const { sticker } = require('../lib/sticker')


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
    let nobg = global.API('lolhuman', '/api/removebg', {
      img: url
    }, 'apikey')
    let stiker = await sticker(null, nobg, global.packname, global.author)
    await m.reply('_Sedang proses mengirim..._')
    conn.sendFile(m.chat, stiker, 'sssss.webp', '', m)
  } catch (e) {
    throw e
    // m.reply('Conversion Failed')
  }
}
handler.help = ['stikernobg', 'snobg', 'nobg'].map(v => v + ' (caption|reply gambar)')
handler.tags = ['sticker']
handler.command = /^(s(tic?ker)?)?nobg$/i
handler.limit = true

module.exports = handler