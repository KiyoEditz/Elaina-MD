
let fetch = require('node-fetch')
let handler = async (m, { conn }) => {
  let res = await fetch(global.API('lolhuman', '/api/random/quotes', '', 'apikey'))
  if (!res.ok) throw 'Server Error.. Harap lapor owner'
  let json = await res.json()
  let final = `_*Pesan:*_\n${json.result.quote}\n\n_*Author:* ${json.result.by}_`
  conn.reply(m.chat, final, m)
}
handler.help = ['quote']
handler.tags = ['quotes']
handler.command = /^quote(s)?$/i

module.exports = handler