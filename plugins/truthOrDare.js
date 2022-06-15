const tod = require('../src/tod.json')
let handler = async (m, { command }) => {
  let teks
  if (/truth/i.test(command)) teks = pickRandom(tod.truth)
  else teks = pickRandom(tod.dare)
  m.reply(teks)
}
handler.help = ['truth', 'dare']
handler.tags = ['fun']
handler.command = /^(truth|dare)$/i

module.exports = handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}