let fetch = require('node-fetch')
let handler = async (m, { conn, command, usedPrefix }) => {
  let res = await fetch(`https://api.waifu.pics/sfw/${command}`)
  m.reply('_Sedang mencari..._')
  let json = await res.json()
  await conn.sendButtonImg(m.chat, json.url, '_Klik *Next* untuk mencari gambar lain_', '', 2, ['⏩ Next', `${usedPrefix + command}`, '💾 Source', `.reply ${json.url}`], m)
}
handler.help = handler.command = ['shinobu', 'megumin', 'waifu', 'neko', 'bully', 'cuddle']
handler.tags = ['imagerandom']

module.exports = handler