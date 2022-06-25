const tod = require('../src/tod.json')
let handler = async (m, { conn, command }) => {
  let teks
  if (/truth/i.test(command)) teks = conn.pickRandom(tod.truth)
  else teks = conn.pickRandom(tod.dare)
  m.reply(teks)
}
handler.help = ['truth', 'dare']
handler.tags = ['fun']
handler.command = /^(truth|dare)$/i

module.exports = handler