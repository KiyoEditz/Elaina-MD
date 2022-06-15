let { promisify } = require('util')
let _gis = require('g-i-s')
let gis = promisify(_gis)
let fetch = require('node-fetch')
let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw `_Masukkan keyword!_\nContoh,\n\n${usedPrefix + command} kucing`
  let results = await gis(text) || []
  m.reply('_Sedang mencari..._')
  let { url, width, height } = pickRandom(results) || {}
  if (!url) throw 'Tidak ditemukan'
  await conn.sendButtonImg(m.chat, url, '_Klik *Next* untuk mencari gambar lain_', `*Width*: ${width}\n*Height*: ${height}`, '⏩ Next', `${usedPrefix + command + ' ' + text}`, '💾 Source', `.reply ${url}`, m)
}
handler.help = ['gimage <Keyword>', 'image <Keyword>']
handler.tags = ['image', 'search']
handler.command = /^(gimage|image)$/i

module.exports = handler

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
