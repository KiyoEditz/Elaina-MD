const { savefrom } = require('@bochilteam/scraper')
let fetch = require('node-fetch')

let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args[0]) throw `_Masukkan link_\n\nContoh:\n${usedPrefix + command} https://www.instagram.com/p/linkurl`
  if (/stories/i.test(args[0])) throw `_Perintah ini untuk mendownload post IG, bukan story_\nGunakan fitur berikut \n\n${usedPrefix}igstory username`
  if (!args[0].match(/(https:\/\/www.)?instagram.com\/([A-Za-z0-9.\_]*\/)?(reel|p|tv)/)) throw `Link tidak valid \n\nContoh:\n${usedPrefix + command} https://www.instagram.com/p/linkurl`
  let dl = await savefrom(args[0])
    .catch(async e => {
      let res = await fetch(global.API('vhtear', '/instadl', { link: args[0] }, 'apikey'))
      let json = await res.json()
      let obj = {
        url: json.result.post.map(v => ({
          url: v.urlDownload
        })
        ),
        meta: {
          title: json.result.caption
        }
      }
      return obj
    }
    ).catch(e => { throw 'Error tidak diketahui..' })
  await m.reply('_Sedang proses mengirim..._')

  for (let { url } of dl.url) {
    conn.sendFile(m.chat, url, 'ig' // + (link.includes('mp4') ? 'mp4' : 'jpg')//
      , dl.meta.title, m, null, { asDocument: global.db.data.users[m.sender].useDocument })
  }
}
handler.help = ['ig', 'instagram'].map(v => v + ' <link>')
handler.tags = ['downloadersosmed']
handler.command = /^(ig|instagram)2?$/i
handler.limit = true

module.exports = handler