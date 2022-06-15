let limit = 30
let fetch = require('node-fetch')
const { servers, ytv, yt } = require('../lib/y2mate')
const q = ['144', '240', '360', '480', '720', '1080']
const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)?youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)?|youtu\.be\/)([-_0-9A-Za-z]{11})/

let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {
  if (!args[0] || !ytIdRegex.test(args[0])) throw `
Ketik ${usedPrefix + command} link/url resolusi[144, 240, 360, 480, 720, 1080]
  
Contoh
${usedPrefix + command} https://youtu.be/abcdfgeth 480`.trim()

  let kasihtau
  if (!args[1]) {
    args[1] = '360'
    kasihtau = true
  }
  if (!q.includes(args[1])) throw 'Kualitas tidak ditemukan\nKualitas tersedia\n' + q.map(v => v).join(', ')
  let user = global.db.data.users[m.sender]
  let kualitas = (args[1] || '360').toLowerCase()
  let hasil = false
  for (let i in servers) {
    let server = servers[i]
    try {
      hasil = await yt(args[0], kualitas + 'p', 'mp4', kualitas, server)
      let { dl_link } = hasil
      if (dl_link == 'https://app.y2mate.com/download') throw false
      break
    } catch (e) { m.reply(`Server ${server} error!${servers.length >= i + 1 ? '' : '\nmencoba server lain...'}`) }
  }
  if (hasil === false) throw 'Semua server error.. Ulangi lagi setelah beberapa menit'
  let { dl_link, thumb, title, filesize, filesizeF } = hasil
  if (dl_link == 'https://app.y2mate.com/download') throw `*Error:* Resolusi tidak didukung oleh Server, pilih reolusi lain\n\nCek ketik *${usedPrefix + command}*`
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
`.trim(),
        "jpegThumbnail": await (await fetch(thumb)).buffer()
      }
    }
  })
  let _thumb = {}
  try { _thumb = { thumbnail: await (await fetch(thumb)).buffer() } }
  catch (e) { }
  if (!isLimit) await conn.sendFile(m.chat, dl_link, title + '.mp4', `
*Title:* ${title}
*Filesize:* ${filesizeF}
`.trim(), m, false, {
    ..._thumb,
    asDocument: user.useDocument
  })
  if (kasihtau) m.reply(`Ingin memilih resolusinya?? ketik *${usedPrefix + command} link kualitas*`)
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

