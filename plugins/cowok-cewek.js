let fetch = require('node-fetch')
let { pinterest } = require('@bochilteam/scraper')
let handler = async (m, { conn, text, usedPrefix, command }) => {
  let res = await pinterest('foto ' + command.replace('k', ''))
  // if (res.result.length == 0) throw 'Tidak ada hasil'
  let pint = conn.pickRandom(res)
  await conn.sendFile(m.chat, pint, 'img.jpg', '', m)
}
handler.help = ['cowok', 'cewek']
handler.tags = ['imagerandom']
handler.command = /^(cowok?|cewek?|perempuan|gadis|model)$/i

module.exports = handler