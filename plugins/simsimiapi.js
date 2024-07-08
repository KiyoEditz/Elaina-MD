
let fetch = require('node-fetch')
let handler = async (m, { text }) => {
  if (!text) throw 'Ketikkan chat'
  let teks = text.replace(/[^A-Za-z]/g, '')
  let res = await fetch(global.API('https://api.simsimi.net', '/v2/', { text: encodeURIComponent(teks), lc: "id" }, ''))
  if (!res.ok) throw eror
  let json = await res.json()
  if (json.success == 'gapaham banh:v') return m.reply('lu ngetik apaaan sih')
  await m.reply(`${json.success}`)

}
handler.help = ['simi <chat>']
handler.tags = ['fun']
handler.command = /^((sim)?simi|simih)$/i

module.exports = handler
