const fetch = require('node-fetch')

const { sticker } = require('../lib/sticker')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let teks = text ? text : m.quoted ? m.quoted.text : m.text
  if (teks) throw `Reply pesan atau ketik pesan\n\nContoh:\n${usedPrefix}attp pipupipap`
  let res = await fetch(global.API('lolhuman', `/api/${command}`, { text: teks }, 'apikey'))
  if (!res.ok) throw 'Server Error.. Harap lapor owner'
  let json = await res.json()
  conn.sendFile(m.chat, json.result, 'attp.webp', '', m)
}
handler.help = ['', '2'].map(v => 'attp' + v + ' <teks>')
handler.command = /^attp2?$/i
handler.tags = ['stickertext']
handler.limit = true

handler.fail = null

module.exports = handler