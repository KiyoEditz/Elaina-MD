let fetch = require('node-fetch')
let handler = async (m, { text }) => {
  if (!text) throw 'Ketikkan chat'
  let teks = text.replace(/[^A-Za-z]/g, '')
  let res = await fetch(global.API('lolhuman', '/api/simi', { text: teks }, 'apikey'))
  if (!res.ok) throw 'Server Error.. Harap lapor owner'
  let json = await res.json()
  m.reply('_*Simi:*_ \n' + json.result)

}
handler.help = ['simi <chat>']
handler.tags = ['fun']
handler.command = /^((sim)?simi|simih)$/i

module.exports = handler