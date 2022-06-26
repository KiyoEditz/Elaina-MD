let { jadwalsholat } = require('@bochilteam/scraper')
let handler = async (m, { conn, text, usedPrefix }) => {
  let d = new Date
  let locale = 'id'
  let gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
  let week = d.toLocaleDateString(locale, { weekday: 'long' })
  let date = d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  if (!text) throw `ketik ${usedPrefix}jadwalsholat daerah/kota\n*Contoh*: ${usedPrefix}jadwalsholat surabaya`

  const res = await jadwalsholat(text)
  if (!res.today) throw 'Server Error.. Harap lapor owner'
  m.reply(`
Jadwal Sholat *${text}*
${week}, ${date}

${Object.entries(res.today).map(([name, data]) => `*${name}:* ${data}`).join('\n').trim()}
`.trim())
}
handler.help = ['jadwalsholat <kota>']
handler.tags = ['tools']
handler.command = /^((jadwal)?sh?[oa]lat)$/i

module.exports = handler