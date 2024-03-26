let { promisify } = require('util')
let _gis = require('g-i-s')
let gis = promisify(_gis)
let fetch = require('node-fetch')
let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw `_Masukkan keyword!_\nContoh,\n\n${usedPrefix + command} kucing`
  let results = await gis(text) || []
  m.reply('_Sedang mencari..._')
  let { url, width, height } = conn.pickRandom(results) || {}
  if (!url) throw 'Tidak ditemukan'
  await conn.sendFile(m.chat, url, 'img.jpg', `*Width*: ${width}\n*Height*: ${height}`, m)
}
handler.help = ['gimage <Keyword>', 'image <Keyword>']
handler.tags = ['image', 'search']
handler.command = /^(gimage|image)$/i
handler.premium = false
module.exports = handler