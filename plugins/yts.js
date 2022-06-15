let yts = require('yt-search')
let handler = async (m, { text, command, usedPrefix }) => {
  if (!text) throw `_Masukkan keyword!_\nContoh:\n\n${usedPrefix + command} oura gaming`
  let results = await yts(text)
  m.reply('_Sedang mencari..._')
  let teks = results.all.map(v => {
    switch (v.type) {
      case 'video': return `
*${v.title}* (${v.url})
Duration: ${v.timestamp}
Uploaded ${v.ago}
${v.views} views
      `.trim()
      case 'channel': return `
*${v.name}* (${v.url})
_${v.subCountLabel} (${v.subCount}) Subscriber_
${v.videoCount} video
`.trim()
    }
  }).filter(v => v).join('\n========================\n')
  m.reply(teks)
}
handler.help = ['', 'earch'].map(v => 'yts' + v + ' pencarian')
handler.tags = ['search']
handler.command = /^yts(earch)?$/i

module.exports = handler