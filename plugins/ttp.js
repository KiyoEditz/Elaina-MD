const { sticker } = require('../lib/sticker')

let fetch = require('node-fetch')

let handler = async (m, { command, conn, text, usedPrefix }) => {
  let teks = text ? text : m.quoted ? m.quoted.text : false
  if (!teks) throw `Reply pesan atau ketik pesan\n\nContoh:\n${usedPrefix + command} pipupipap`
  let res = await fetch(global.API('lolhuman', `/api/${command}`, { text: teks }, 'apikey'))
  let img = await res.buffer()
  if (!img) throw img
  let stiker = await sticker(img, false, global.packname, global.author)
  conn.sendFile(m.chat, stiker, 'ttp.webp', '', m)
}
// handler.help = ['', '2', '3', '4', '5', '6'].map(v => 'ttp' + v + ' <teks>')
// handler.command = /^ttp[2-6]?$/i
// handler.tags = ['stickertext']
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.disabled = true
handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler