let { wikipedia } = require('@bochilteam/scraper')

let handler = async (m, { text }) => {
  let json = await wikipedia(text)
  if (!json.ok) throw 'Tidak ada'
  m.reply(`
*${json.title}*
${json.img}
${json.articles}
`.trim())
}
handler.help = ['wikipedia'].map(v => v + ' <apa>')
handler.tags = ['belajar']
handler.command = /^(wiki(pedia)?)$/i
//belajar ngocok
module.exports = handler
