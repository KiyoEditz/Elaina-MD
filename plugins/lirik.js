let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) throw `_Masukkan judul lagu_\n\nContoh:\n${usedPrefix}lirik melukis senja`
  let res = await fetch(global.API('lolhuman', '/api/lirik', { query: text }, 'apikey'))
  if (!res.ok) throw 'Server Error.. Harap lapor owner'
  let json = await res.json()
  conn.reply(m.chat, json.result.trim(), m)
}
handler.help = ['lirik <judul lagu>']
handler.tags = ['media', 'search']

handler.command = /^(lirik|lyrics?)$/i

module.exports = handler
