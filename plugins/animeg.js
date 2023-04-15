let fetch = require('node-fetch')
let handler = async (m, { conn, command, usedPrefix }) => {
  let res = await fetch(`https://api.waifu.pics/sfw/${command}`)
  m.reply('_Sedang mencari..._')
  let json = await res.json()
  await conn.sendFile(m.chat, json.url, 'img.jpg', '', m)
}
handler.help = handler.command = ['shinobu', 'megumin', 'waifu', 'neko', 'bully', 'cuddle']
handler.tags = ['imagerandom']

module.exports = handler