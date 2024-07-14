const fetch = require('node-fetch')

const { sticker } = require('../lib/sticker')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
  if (!teks) throw `Reply pesan atau ketik pesan\n\nContoh:\n${usedPrefix}attp pipupipap`
  let res = await sticker(null, global.API('https://api.erdwpe.com/api/maker/', 'attp?text', { file: '', text: teks }), global.packname, global.author)
  if (res) return conn.sendFile(m.chat, res, 'sticker.webp', '', m)
  throw stiker.toString()
}
handler.help = ['', '2'].map(v => 'attp' + v + ' <teks>')
handler.command = /^a?ttp$/i
handler.tags = ['stickertext']
handler.limit = true
handler.fail = null

module.exports = handler