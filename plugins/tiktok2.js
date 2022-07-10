const { toAudio } = require('../lib/converter')
const { tiktokdl } = require('@bochilteam/scraper')
let fetch = require('node-fetch')
// let { tiktokApi, tiktok3, tiktok, tiktok2, tiktokApi2, tiktokApi3 } = require('../lib/scrape')
let handler = async (m, { conn, args, usedPrefix, command, isPrems }) => {
  let link = /https?:\/\/(www\.|v(t|m)\.|t\.)?tiktok\.com\/.*/i
  if (!(link.test(args[0]) && args[0])) throw `Contoh\n\nKetik ${usedPrefix}tiktok https://vm.tiktok/blbala`
  const { author: { nickname }, video, description } = await tiktokdl(args[0])
  const url = video.no_watermark || video.no_watermark2 || video.no_watermark_raw
  let mp3 = /musi[ck]/i.test(command)
  if (!mp3) {
    if (!isPrems) m.limit = true
    await m.reply('_Sedang proses mengirim..._')
  }
  await conn.sendFile(m.chat, url, (new Date * 1) + (mp3 ? '.mp3' : '.mp4'), `@${nickname}\n${description}`, m, null, { asDocument: global.db.data.users[m.sender].useDocument, mimetype: (mp3 ? 'audio/mpeg' : null) })
  if (!mp3) {
    conn.reply(m.chat, 'Mau ambil lagu nya?\nKetik .tomp3 ', m)
  }
}
handler.help = ['tiktok', 'tiktokmusic'].map(v => v + ' <link>')
handler.tags = ['downloadersosmed']
handler.command = /^(t(ik)?t(ok)?2?)(musi[ck])?$/i

module.exports = handler