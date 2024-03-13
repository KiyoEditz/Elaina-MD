let limit = 30

const { youtubedl } = require('@bochilteam/scraper')
let fetch = require('node-fetch')
const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)?youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)?|youtu\.be\/)([-_0-9A-Za-z]{11})/

let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {
  if (!args || !args[0] || !ytIdRegex.test(args[0])) throw `
  Ketik ${usedPrefix + command} link/url 
    
  Contoh
  ${usedPrefix + command} https://youtu.be/inihuruf`.trim()

  let yt = await youtubedl(args[0])
  let { fileSize, fileSizeH, download } = yt.audio['128kbps']
  let isLimit = (isPrems || isOwner ? 99 : limit) * 1024 < fileSize
  conn.reply(m.chat, `
${isLimit ? `
*Source:* ${args[0]}
*Ukuran File:* ${fileSizeH}
_File terlalu besar, Download langsung dengan browser sekali klik menggunakan link:_ ${download()}` : '_Sedang proses mengirim..._\n_Mohon tunggu sebentar jangan spam desu_ ^_^'}
`.trim(), {
    key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net', fromMe: false }, message: {
      "imageMessage": {
        "mimetype": "image/jpeg", "caption": `
*Judul:* ${yt.title}
*Ukuran File:* ${fileSizeH}`.trim(),
        "jpegThumbnail": await (await fetch(yt.thumbnail)).buffer()
      }
    }
  })
  // m.reply((await download()).toString())
  if (!isLimit) {
    conn.sendFile(m.chat, await download(), yt.title + '.mp3', '', m, null, {
      asDocument: true
    })
    conn.sendFile(m.chat, await download(), yt.title + '.mp3', '', m, null, {
      asDocument: false
    })
  }
}
handler.help = ['mp3', 'a'].map(v => 'yt' + v + ` <link>`)
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