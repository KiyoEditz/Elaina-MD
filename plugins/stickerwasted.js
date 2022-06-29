const uploadImage = require('../lib/uploadImage')
const { sticker } = require('../lib/sticker')

let { webp2png } = require('../lib/webp2mp4')
let fetch = require('node-fetch')
let handler = async (m, { conn, command }) => {
  let url
  let anu = command.replace('ed', '')
  if (m.mentionedJid[0]) {
    let buffer = await (await fetch(await conn.profilePictureUrl(m.mentionedJid[0], 'image').catch(e => { throw `Orang yang kamu tag tidak ada PP atau PP nya sedang diprivasi` }))).buffer()
    url = await uploadImage(buffer)
  } else {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!(mime || /image\/(jpe?g|png)|webp/.test(mime))) throw `Reply stiker/gambar`
    let img = await q.download()
    if (/webp/.test(mime)) url = await webp2png(img)
    else url = await uploadImage(img)
  }
  m.reply('_Sedang proses mengirim..._')
  let link = `https://some-random-api.ml/canvas/${anu}ed?avatar=${url}`
  // if (wasted.status !== 200) throw e  'Server Error.. Harap lapor owner'
  let stiker = await sticker(null, link, 'hm', global.author)
  conn.sendFile(m.chat, stiker, 'sssss.webp', '', m)
}

handler.help = ['trigger', 'wasted'].map(v => v + ' (caption/reply)')
handler.tags = ['stickerother']
handler.command = /^(wasted|trigger(ed)?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler