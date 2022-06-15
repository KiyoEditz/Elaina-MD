const { createExif, modStick } = require("../lib/exif")

let handler = async (m, { conn, args }) => {
  let sender = global.db.data.users[m.sender].registered ? global.db.data.users[m.sender].name : await conn.getName(m.sender)
  const content = JSON.stringify(m.message)
  const type = Object.keys(m.message)[0]
  const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
  if (!isQuotedSticker) throw m.reply('_*Reply stikernya!*_')
  encmedia = JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
  media = await conn.downloadAndSaveMediaMessage(encmedia)
  anu = args.join(' ').split('|')
  console.log(anu)
  satu = anu[0] !== '' ? anu[0] : global.packname
  dua = typeof anu[1] !== 'undefined' ? anu[1] : sender
  createExif(satu, dua)
  modStick(media, conn, m, m.chat)
}
handler.help = ['steal', 'sticker'].map(v => v + ' <packname|author>')
handler.tags = ['stickerprems', 'premium']
handler.command = /^(steal|ambil|colong)$/i
handler.premium = true
handler.fail = null
handler.limit = false

module.exports = handler