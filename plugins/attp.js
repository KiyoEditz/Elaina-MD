const fetch = require('node-fetch')

const { sticker } = require('../lib/sticker')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let teks = text ? text : m.quoted ? m.quoted.text : m.text
  let res = await fetch(global.API('vhtear', `/textgif`, { text: teks }, 'apikey'))
  if (!res.ok) throw 'Server Error.. Harap lapor owner'
  let json = await res.buffer()
  let stiker = await sticker(json, false, global.packname, global.author)
  conn.sendFile(m.chat, stiker, 'attp.webp', '', m)
}
handler.help = [''].map(v => 'attp' + v + ' <teks>')
handler.command = /^attp2?$/i
handler.tags = ['stickertext']
handler.limit = true
handler.fail = null

module.exports = handler