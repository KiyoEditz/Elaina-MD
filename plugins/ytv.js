let limit = 30
let fetch = require('node-fetch')
const { youtubedl } = require('@bochilteam/scraper')
const q = ['144', '240', '360', '480', '720', '1080']
const { ytIdRegex } = require('../lib/y2mate')

let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {
  if (!args[0] || !ytIdRegex.test(args[0])) throw `
Ketik ${usedPrefix + command} link/url resolusi[144, 240, 360, 480, 720, 1080]
  
Contoh
${usedPrefix + command} https://youtu.be/yoururl 480`.trim()

  let kasihtau
  if (!args[1]) {
    args[1] = '360'
    kasihtau = true
  }
  if (!q.includes(args[1])) throw 'Kualitas tidak ditemukan\nKualitas tersedia\n' + q.map(v => v).join(', ')
  let user = global.db.data.users[m.sender]
  let kualitas = (args[1] || '360').toLowerCase().replace(/[a-z]/i, '') + 'p'
  let yt = await youtubedl(args[0])
  let { title, thumbnail } = yt
  let { fileSize, fileSizeH, download } = yt.video[kualitas]
  let isLimit = (isPrems || isOwner ? 99 : limit) * 1024 < fileSize
  let dl = await download()
  conn.reply(m.chat, `
${isLimit ? `
*Source:* ${args[0]}
*Ukuran File:* ${fileSizeH}
_File terlalu besar, Download langsung dengan browser sekali klik menggunakan link:_ $${dl.toString()}` : '_Sedang proses mengirim..._\n_Mohon tunggu sebentar jangan spam desu_ ^_^'}
`.trim(), {
    key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net', fromMe: false }, message: {
      "imageMessage": {
        "mimetype": "image/jpeg", "caption": `
*Judul:* ${title}
`.trim(),
        "jpegThumbnail": await (await fetch(thumbnail)).buffer()
      }
    }
  })
  let _thumb = {}
  try { _thumb = { thumbnail: await (await fetch(thumbnail)).buffer() } }
  catch (e) { }
  if (!isLimit) await conn.sendFile(m.chat, dl, title + '.mp4', `
*Title:* ${title}
*Filesize:* ${fileSizeH}
`.trim(), m, false, {
    ..._thumb,
    asDocument: user.useDocument
  })
  if (kasihtau) m.reply(`Ingin memilih resolusinya?? ketik *${usedPrefix + command} <link> <144/240,360,480,720>*`)
}
handler.help = ['mp4', ''].map(v => 'yt' + v + ` <link> [quality: 144, 240, 360, 480, 720, 1080]`)
handler.tags = ['downloader']
handler.command = /^y(ou)?t(ube)?(v|mp4)?$/i
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

