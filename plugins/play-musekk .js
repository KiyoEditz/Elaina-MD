let limit = 30
let yts = require('yt-search')
let fetch = require('node-fetch')
const { servers, yta, ytv } = require('../lib/y2mate')
let handler = async (m, { conn, command, text, isPrems, isOwner, usedPrefix }) => {
  let txt = text ? text : m.quoted.text
  if (!txt) throw `Reply Pesan!!`
  let results = await yts(txt)
  m.reply(`Memutar lagu *${txt}...*`)
  let vid = results.all.find(video => video.seconds < 900)
  if (!vid) throw 'lagu Tidak ditemukan'
  let isVideo = /2$/.test(command)
  let yt = false
  let usedServer = servers[0]
  for (let i in servers) {
    let server = servers[i]
    try {
      yt = await (isVideo ? ytv : yta)(vid.url, server)
      usedServer = server
      break
    } catch (e) {
      m.reply(`Server ${server} error!${servers.length >= i + 1 ? '' : '\nmencoba server lain...'}`)
    }
  }
  if (yt === false) throw 'Semua server tidak bisa :/'
  let { dl_link, thumb, title, filesize, filesizeF } = yt
  let isLimit = (isPrems || isOwner ? 99 : limit) * 1024 < filesize
  await m.reply(`
*Judul:* ${title}
*Source:* ${vid.url} (${filesizeF}) ${isLimit ? `\n_File terlalu besar, Download sendiri pakai Link:_ ${dl_link}` : ''}
`.trim())
  let _thumb = {}
  try { if (isVideo) _thumb = { thumbnail: await (await fetch(thumb)).buffer() } }
  catch (e) { }

  if (!isLimit) {
    // no document
    conn.sendFile(m.chat, dl_link, title + '.mp3', null, m, true, { mimetype: 'audio/mp4' })
  }
}
handler.command = /^playy$/i

handler.exp = 0
handler.limit = true

module.exports = handler