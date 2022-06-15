let limit = 30
const { servers, yta } = require('../lib/y2mate')
let fetch = require('node-fetch')
const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)?youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)?|youtu\.be\/)([-_0-9A-Za-z]{11})/

let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {
  if (!args || !args[0] || !ytIdRegex.test(args[0])) throw `
  Ketik ${usedPrefix + command} link/url 
    
  Contoh
  ${usedPrefix + command} https://youtu.be/inihuruf`.trim()
  let chat = global.db.data.chats[m.chat]
  let server = (args[1] || servers[0]).toLowerCase()
  let { dl_link, thumb, title, filesize, filesizeF } = await yta(args[0], servers.includes(server) ? server : servers[0])
  let isLimit = (isPrems || isOwner ? 99 : limit) * 1024 < filesize
  conn.reply(m.chat, `
${isLimit ? `
*Source:* ${args[0]}
*Ukuran File:* ${filesizeF}
_File terlalu besar, Download langsung dengan browser sekali klik menggunakan link:_ ${dl_link}` : '_Sedang proses mengirim..._\n_Mohon tunggu sebentar jangan spam desu_ ^_^'}
`.trim(), {
    key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net', fromMe: false }, message: {
      "imageMessage": {
        "mimetype": "image/jpeg", "caption": `
*Judul:* ${title}
*Ukuran File:* ${filesizeF}`.trim(),
        "jpegThumbnail": await (await fetch(thumb)).buffer()
      }
    }
  })
  if (!isLimit) {
    conn.sendFile(m.chat, dl_link, title + '.mp3', '', m, null, {
      asDocument: true
    })
    conn.sendFile(m.chat, dl_link, title + '.mp3', '', m, null, {
      asDocument: false
    })
  }
}
handler.help = ['mp3', 'a'].map(v => 'yt' + v + ` <link> [server: ${servers.join(', ')}]`)
handler.tags = ['downloader']
handler.command = /^yt(a|mp3)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
handler.limit = true

module.exports = handler

