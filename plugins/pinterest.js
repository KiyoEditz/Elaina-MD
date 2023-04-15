let { pinterest } = require('@bochilteam/scraper')
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} minecraft`
  let res = await pinterest(text)
  // if (res.result.length == 0) throw 'Tidak ada hasil'
  let pint = conn.pickRandom(res)
  await conn.sendFile(m.chat, pint, 'img.jpg', `_Hasil dari ${text}_`, m)
}
handler.help = ['pinterest <keyword>']
handler.tags = ['image', 'search']
handler.command = /^(pinterest)$/i

module.exports = handler
