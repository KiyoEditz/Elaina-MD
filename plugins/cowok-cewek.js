let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix, command }) => {
  let res = await fetch(global.API('lolhuman', '/api/pinterest2', {
    query: command + (text ? text : '')
  }, 'apikey'))
  m.reply('_Sedang mencari..._')
  if (!res.ok) throw 'Server Error.. Harap lapor owner'
  let json = await res.json()
  if (json.result.length == 0) throw 'Tidak ada hasil'
  let pint = json.result[Math.floor(Math.random() * json.result.length)];
  await conn.sendButtonImg(m.chat, pint, '_Klik *Next* untuk mencari gambar lain_', ``, 2, ['⏩ Next', `${usedPrefix + command + ' ' + text}`, '💾 Source', `.reply ${pint}`], m)
}
handler.help = ['cowok', 'cewek']
handler.tags = ['imagerandom']
handler.command = /^(cowok?|cewek?|perempuan|gadis|model)$/i

module.exports = handler