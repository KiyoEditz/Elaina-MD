let { pinterest } = require('@bochilteam/scraper')
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} minecraft`
  let res = await pinterest(text)
  // if (res.result.length == 0) throw 'Tidak ada hasil'
  let pint = conn.pickRandom(res)
  await conn.sendButtonImg(m.chat, pint, '_Klik *Next* untuk mencari gambar lain_', `_Hasil dari ${text}_`, 2, ['⏩ Next', `${usedPrefix + command + ' ' + text}`, '💾 Source', `.reply ${pint}`], m)
}
handler.help = ['pinterest <keyword>']
handler.tags = ['image', 'search']
handler.command = /^(pinterest)$/i

module.exports = handler
