let fetch = require('node-fetch')
let util = require('util')
let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) throw `Masukkan judul\nContoh ${usedPrefix}anime Anohana`
  m.reply('_Sedang mencari..._')
  let res = await fetch(global.API('lolhuman', '/api/otakudesusearch', {
    query: encodeURIComponent(text)
  }, 'apikey'))
  if (!res.ok) throw 'Server Error.. Harap lapor owner'
  let json = await res.json()
  if (!json.result) throw json
  let {
    japanese,
    judul,
    episodes,
    aired,
    title,
    producers,
    genres,
    duration,
    studios,
    rating,
    link_dl
  } = json.result
  let hasil = json.result.link_dl.map((v) => `
*${v.title}* ${v.link_dl.map((v) => `
*Resolusi:* ${v.reso}
*Ukuran:* ${v.size}
*Link:* ${util.format(v.link_dl)}`).join('\n----------------------------------')}
`).join('\n==================')

  let teks = `
*Otakudesu Search*

*Pencarian:* ${judul}
*Judul:* ${title} (${japanese})
*Aired:* ${aired}
*Produser:* ${producers}
*Genre:* ${genres}
*Episode:* ${episodes}
*Duration:* ${duration}
*Rating:* ${rating}
`.trim()

  m.reply(teks + '\n\n' + hasil.trim())
}
handler.help = ['anime <judul>']
handler.tags = ['downloaderanime']
handler.command = /^(anime)$/i
handler.disabled = true
module.exports = handler