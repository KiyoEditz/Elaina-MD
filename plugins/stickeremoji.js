const { sticker } = require('../lib/sticker')
const { EmojiAPI } = require("emoji-api")
const emoji = new EmojiAPI()

let handler = async (m, { usedPrefix, conn, args, text }) => {
  let er = `_Masukkan emoji_

_Hanya bisa 1 emoji saja_
Contoh:
*${usedPrefix}emo wa ❤️*

Jika tanpa type, 
maka default nya adalah WhatsApp

╔══「 Pilihan Type 」
╟ ap = apple
╟ fb = facebook
╟ go = google
╟ ht = htc
╟ lg
╟ mi = microsoft
╟ mo = mozilla
╟ op = openmoji
╟ pi = pixel
╟ sa = samsung
╟ tw = twitter
╟ wa = whatsapp
╚════════════════`.trim()
  if (!(args[0] || args[1])) throw er
  let template = 'wa'
  if (args[0].length == 3) template = args[0].toLowerCase()
  let emo = args.join(' ').replace(/[A-Za-z]/g, '')
  try {
    let res = await emoji.get(emo.trim())
    let stik = res.images
    let stiker
    switch (template) {
      case 'apple':
      case 'ip':
      case 'ap':
        stiker = stik[0]
        break
      case 'facebook':
      case 'fb':
      case 'fa':
        stiker = stik[6]
        break
      case 'google':
      case 'go':
        stiker = stik[1]
        break
      case 'htc':
      case 'ht':
        stiker = stik[12]
        break
      case 'lg':
        stiker = stik[11]
        break
      case 'microsoft':
      case 'mc':
      case 'mi':
        stiker = stik[3]
        break
      case 'mozilla':
      case 'moz':
      case 'mo':
        stiker = stik[13]
        break
      case 'openmoji':
      case 'omoji':
      case 'op':
        stiker = stik[8]
        break
      case 'pixel':
      case 'pi':
        stiker = stik[7]
        break
      case 'samsung':
      case 'ss':
      case 'sa':
        stiker = stik[2]
        break
      case 'twitter':
      case 'tw':
        stiker = stik[5]
        break
      case 'whatsapp':
      case 'wa':
      case 'wh':
        stiker = stik[4]
        break

    }
    let finish = await sticker(null, stiker.url, global.packname, global.author)
    //   m.reply(`
    // Tipe: ${tipe}
    // Emoji: ${emoji}
    // `.trim())
    m.reply(finish)
  } catch (e) {
    throw er
  }

}
handler.help = ['emo', 'semoji'].map(v => v + ' [tipe] <emoji>')
handler.tags = ['stickerother']
handler.command = /^s?emo(ji)?$/i
module.exports = handler
