let fetch = require('node-fetch')
let handler = async (m, { conn, usedPrefix, command }) => {
  let res = global.API('lolhuman', '/api/meme/darkjoke', '', 'apikey')
  m.reply('_Sedang mencari..._')
  await conn.sendFile(m.chat, res, 'ing.jpg', `(ﾉ◕ヮ◕)ﾉ*.✧ :v`, m)
}
handler.help = ['darkjoke']
handler.tags = ['imagerandom']
handler.command = /^darkjoke(s)?$/i

module.exports = handler