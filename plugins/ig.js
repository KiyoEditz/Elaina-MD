const { instagramdl, instagramdlv2, instagramdlv3, instagramdlv4 } = require('@bochilteam/scraper')
let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args[0]) throw `_Masukkan link_\n\nContoh:\n${usedPrefix + command} https://www.instagram.com/p/linkurl`
  if (/stories/i.test(args[0])) throw `_Perintah ini untuk mendownload post IG, bukan story_\nGunakan fitur berikut \n\n${usedPrefix}igstory username`
  if (!args[0].match(/(https:\/\/www.)?instagram.com\/([A-Za-z0-9.\_]*\/)?(reel|p|tv)/)) throw `Link tidak valid \n\nContoh:\n${usedPrefix + command} https://www.instagram.com/p/linkurl`
  let dl = await instagramdl(args[0])
    .catch(async _ => await instagramdlv2(args[0]))
    .catch(async _ => await instagramdlv3(args[0]))
    .catch(async _ => await instagramdlv4(args[0]))
  await m.reply('_Sedang proses mengirim..._')
  m.reply(dl)
  for (let { url: link } of dl) {
    conn.sendFile(m.chat, link, 'ig' // + (link.includes('mp4') ? 'mp4' : 'jpg')//
      , '', m, null, { asDocument: global.db.data.users[m.sender].useDocument })
  }
}
handler.help = ['ig', 'instagram'].map(v => v + ' <link>')
handler.tags = ['downloadersosmed']
handler.command = /^(ig|instagram)2?$/i
handler.limit = true

module.exports = handler