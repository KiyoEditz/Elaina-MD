const { toAudio } = require('../lib/converter')
const { tiktokdl } = require('@bochilteam/scraper')
let fetch = require('node-fetch')
let { tiktokApi, tiktok3, tiktok, tiktok2, tiktokApi2, tiktokApi3 } = require('../lib/scrape')
let handler = async (m, { conn, args, usedPrefix, command, isPrems }) => {
  if (!(args[0] && args[0].startsWith('http'))) throw `Contoh\n\nKetik ${usedPrefix}tiktok https://vm.tiktok/blbala`
  // let tt = false
  // for (let func of [tiktokApi, tiktok, tiktok2, tiktokApi2, tiktokApi3]) {
  //   try {
  //     tt = await func(args[0])
  //     await conn.getFile(tt.link)
  //     break
  //   } catch { m.reply('Gagal.. mencoba server lain..') }
  // }
  // if (tt === false) throw `Semua server gagal..`
  // else {
  const { author: { nickname }, video, description } = await tiktokdl(args[0])
  const url = video.no_watermark || video.no_watermark2 || video.no_watermark_raw
  // let { title, link, username, nickname, server } = tt
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer)
  let audio = await toAudio(buffer, 'mp4')
  //     let caption = username ? `
  // *Username:* ${username} ( ${nickname} )${title == '' ? '\n\n' + title + '\n' : ''}
  // *Server:* ${server}`.trim() : `*Server:* ${server}`
  let mp3 = /musi[ck]/i.test(command)
  if (!mp3) {
    if (!isPrems) m.limit = true
    await m.reply('_Sedang proses mengirim..._')
  }
  else m.reply('Tunggu sebentar...')
  await conn.sendFile(m.chat, (mp3 ? audio : url), (new Date * 1) + (mp3 ? '.mp3' : '.mp4'), '', m, null, { asDocument: global.db.data.users[m.sender].useDocument })
  if (!mp3) {
    conn.sendButton(m.chat, 'Mau ambil lagu nya?', 'No limit', 1, ['Get', '.ttmusic ' + args[0]], m)
  }
}
handler.help = ['tiktok', 'tiktokmusic'].map(v => v + ' <link>')
handler.tags = ['downloadersosmed']
handler.command = /^(t(ik)?t(ok)?2?)(musi[ck])?$/i

module.exports = handler