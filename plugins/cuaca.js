let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) throw `_Masukkan nama kota!_\n\nContoh:\n${usedPrefix}cuaca bandung`
  let res = await fetch(global.API('lolhuman', '/api/cuaca/' + text, '', 'apikey'))
  let json = await res.json()
  if (!json.result.tempat) throw 'Maaf kota yang kamu cari tidak tersedia'
  let { tempat } = json.result
  let teks = `Cuaca daerah *${tempat}:*

${Object.entries(json.result).map(v => `*${v[0][0].toUpperCase() + v[0].substring(1)}:* ${v[1]}`).join('\n')}`
  conn.reply(m.chat, teks, m)
}
handler.help = ['cuaca <daerah>']
handler.tags = ['tools']
handler.command = /^cuaca$/i

module.exports = handler