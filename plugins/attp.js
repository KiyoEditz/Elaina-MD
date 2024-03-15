const fetch = require('node-fetch')

const { sticker } = require('../lib/sticker')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let teks = text ? text : m.quoted ? m.quoted.text : false
  if (!teks) throw `Reply pesan atau ketik pesan\n\nContoh:\n${usedPrefix}attp pipupipap`
  let res = await fetch(global.API('alya', `api/${command}`, { q: teks }, 'apikey'))
  if (!res.status) throw 'Server Error.. Harap lapor owner'
  let json = (await res.json()).data.url
  let stiker = await sticker(json, false, global.packname, global.author)
  conn.sendFile(m.chat, stiker, 'attp.webp', '', m)
}
handler.help = ['', '2'].map(v => 'attp' + v + ' <teks>')
handler.command = /^a?ttp$/i
handler.tags = ['stickertext']
handler.limit = true
handler.fail = null

module.exports = handler