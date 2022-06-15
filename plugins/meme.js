let fetch = require('node-fetch')
let handler = async (m, { conn, usedPrefix, command }) => {
  let res = global.API('lolhuman', '/api/meme/memeindo', '', 'apikey')
  m.reply('_Sedang mencari..._')
  await conn.sendButtonImg(m.chat, res, '_Klik *Next* untuk mencari gambar lain_', `(ﾉ◕ヮ◕)ﾉ*.✧`, '⏩ Next', `${usedPrefix + command}`, m)
}
handler.help = ['meme'].map(v => v + '')
handler.tags = ['imagerandom']

handler.command = /^meme$/i

module.exports = handler