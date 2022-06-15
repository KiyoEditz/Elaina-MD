let fetch = require('node-fetch')
let handler = async (m, { text }) => {
  let res = await fetch(global.API('lolhuman', '/api/wiki', { query: text }, 'apikey'))
  if (!res.ok) throw 'Server Error.. Harap lapor owner'
  let json = await res.json()
  if (!json.result) throw 'Error!'
  m.reply(`${json.result.trim()}`)

}
handler.help = ['wikipedia'].map(v => v + ' <apa>')
handler.tags = ['belajar']
handler.command = /^(wiki(pedia)?)$/i
//belajar ngocok
module.exports = handler
