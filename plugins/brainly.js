const brainly = require('brainly-scraper-v2')
let handler = async function (m, { text, usedPrefix }) {
  if (!text) throw `_Masukkan soal!_\nContoh\n\n${usedPrefix}brainly tuliskan pasal ayat 1 pasal 1 UUD 1945`
  let res = await brainly(text)
  let answer = res.data.map((v, i) => `_*PERTANYAAN KE ${i + 1}*_\n${v.pertanyaan}\n${v.jawaban.map((v, i) => `*JAWABAN KE ${i + 1}*\n${v.text}`).join('\n')}`).join('\n\n•------------•\n\n')
  m.reply(answer)
}
handler.help = ['brainly <soal>']
handler.tags = ['belajar']

handler.command = /^brainly$/i

module.exports = handler