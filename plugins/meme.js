let fetch = require('node-fetch')
let handler = async (m, { conn, usedPrefix, command }) => {
  let res = global.API('lolhuman', '/api/meme/memeindo', '', 'apikey')
  m.reply('_Sedang mencari..._')
  await conn.sendFile(m.chat, res, 'img.jpg', `(ﾉ◕ヮ◕)ﾉ*.✧`, m)
}
handler.help = ['meme'].map(v => v + '')
handler.tags = ['imagerandom']

handler.command = /^meme$/i

module.exports = handler