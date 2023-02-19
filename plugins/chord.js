let fetch = require('node-fetch')
let handler = async (m, { text, usedPrefix }) => {
  if (!text) throw `ketik ${usedPrefix}chord judul lagu nya`
  let res = await fetch(global.API('lolhuman', '/api/chord', { query: text }, 'apikey'))
  if (!res.ok) throw 'Server Error.. Harap lapor owner'
  let json = await res.json()
  if (!json.result.title) throw 'Lagu tidak ditemukan'
  let { title, chord } = json.result
  let chords = `
*Judul:* ${title}

${chord}
`.trim()
  m.reply(chords)
}
handler.help = ['chord <judul lagu>']
handler.tags = ['media', 'search']
handler.command = /^(chord)$/i