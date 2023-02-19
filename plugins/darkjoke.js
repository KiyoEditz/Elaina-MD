let fetch = require('node-fetch')
let handler = async (m, { conn, usedPrefix, command }) => {
  let res = global.API('lolhuman', '/api/meme/darkjoke', '', 'apikey')
  m.reply('_Sedang mencari..._')
  await conn.sendButtonImg(m.chat, res, '_Klik *Next* untuk mencari gambar lain_', `(ﾉ◕ヮ◕)ﾉ*.✧ :v`, 1, ['⏩ Next', `${usedPrefix + command}`], m)
}
handler.help = ['darkjoke'].map(v => v + '')
handler.tags = ['imagerandom']
handler.command = /^darkjoke(s)?$/i
handler.disabled = 1
module.exports = handler