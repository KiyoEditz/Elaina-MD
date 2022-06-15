let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} minecraft`
  let res = await fetch(global.API('lolhuman', '/api/pinterest2', {
    query: text
  }, 'apikey'))
  m.reply('_Sedang mencari..._')
  if (!res.ok) throw 'Server Error.. Harap lapor owner'
  let json = await res.json()
  if (json.result.length == 0) throw 'Tidak ada hasil'
  let pint = json.result[Math.floor(Math.random() * json.result.length)];
  await conn.sendButtonImg(m.chat, pint, '_Klik *Next* untuk mencari gambar lain_', `_Hasil dari ${text}_`, '⏩ Next', `${usedPrefix + command + ' ' + text}`, '💾 Source', `.reply ${pint}`, m)
}
handler.help = ['pinterest <keyword>']
handler.tags = ['image', 'search']
handler.command = /^(pinterest)$/i

module.exports = handler
