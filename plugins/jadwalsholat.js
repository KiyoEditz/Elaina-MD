let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix }) => {
  let d = new Date
  let locale = 'id'
  let gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
  let week = d.toLocaleDateString(locale, { weekday: 'long' })
  let date = d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  if (!text) throw `ketik ${usedPrefix}jadwalsholat daerah/kota\n*Contoh*: ${usedPrefix}jadwalsholat surabaya`
  let res = await fetch(global.API('lolhuman', '/api/sholat/' + text, '', 'apikey'))
  if (!res.ok) throw 'Server Error.. Harap lapor owner'
  let json = await res.json()
  if (json.status !== 200) throw 'Maaf kota yang kamu cari tidak tersedia'
  let preJadwal = Object.entries(json.result)
  let jadwal = preJadwal.map(v => `*${v[0][0].toUpperCase() + v[0].substring(1)}:* ${v[1]}`).join('\n')
  let teks = `*Jadwal Sholat*\nHari: ${week}\nTanggal: ${date}\n\n*Waktu*\n${jadwal}`
  conn.reply(m.chat, teks.trim(), m)
}
handler.help = ['jadwalsholat <kota>']
handler.tags = ['tools']
handler.command = /^((jadwal)?sh?[oa]lat)$/i

module.exports = handler