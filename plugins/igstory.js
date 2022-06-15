let { igstory } = require('../lib/scrape')
let handler = async (m, { conn, args, isPrems }) => {
  if (!args[0] || !(/^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/i.test(args[0]))) throw 'Masukan username tanpa @'
  let res = await igstory(args[0])
  if (res == undefined) throw 'Username tidak ditemukan'
  m.reply('_Sedang proses mengirim..._')
  for (let i of res) {
    if (i.length == 0) throw 'Tidak ada story'
    if (i.downloadUrl.includes('.jpg')) {
      type = '.jpg'
    } else { type = '.mp4' }
    conn.sendFile(m.chat, i.downloadUrl, args[0] + new Date() * 1 + type, `@${args[0]}`, m)
  }
  if (!isPrems) m.limit = res.length
}
handler.help = ['igstory <username>']
handler.tags = ['downloadersosmed']

handler.command = /^(igstory)$/i
handler.private = false

module.exports = handler
