let fetch = require('node-fetch')
let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args[0]) throw `_Masukkan link_\n\nContoh:\n${usedPrefix + command} https://www.instagram.com/p/linkurl`
  if (/stories/i.test(args[0])) throw `_Perintah ini untuk mendownload post IG, bukan story_\nGunakan fitur berikut \n\n${usedPrefix}igstory username`
  if (!args[0].match(/(https:\/\/www.)?instagram.com\/([A-Za-z0-9.\_]*\/)?(reel|p|tv)/)) throw `Link tidak valid \n\nContoh:\n${usedPrefix + command} https://www.instagram.com/p/linkurl`
  let igres = false
  let allFunc = [ig2, ig, igNoAPI, igreel]
  if (args[0].includes('reel')) allFunc = [ig, igreel, ig2, ig, igNoAPI]
  for (let func of allFunc) {
    try {
      igres = await func(args[0])
      await conn.getFile(igres.dl)
      break
    } catch (e) { m.reply('Gagal.. mencoba server lain..') }
  }
  if (igres == false) throw `Semua server gagal`
  else {
    let { username, caption, server, dl } = igres
    await m.reply('_Sedang proses mengirim..._')
    if (Array.isArray(igres.dl)) {
      m.reply(`Total ${igres.dl.length}`)
      for (let link of igres.dl) {
        conn.sendFile(m.chat, link, 'ig.' + (link.includes('mp4') ? 'mp4' : 'jpg'), (username ? ('*Username:* @' + username + '\n\n' + caption) : '') + '\n\n*Server:* ' + server, m, null, { asDocument: global.db.data.users[m.sender].useDocument })
      }
    } else await conn.sendFile(m.chat, dl, 'ig.' + (dl.includes('mp4') ? 'mp4' : 'jpg'), (username ? ('*Username:* @' + username + '\n\n' + caption) : '') + '\n\n*Server:* ' + server.trim(), m, null, { asDocument: global.db.data.users[m.sender].useDocument })
  }

}
handler.help = ['ig', 'instagram'].map(v => v + ' <link>')
handler.tags = ['downloadersosmed']
handler.command = /^(ig|instagram)2?$/i
handler.limit = true

module.exports = handler

const delay = time => new Promise(res => setTimeout(res, time))
const cheerio = require('cheerio')
const FormData = require('form-data')

async function igNoAPI(url) {
  if (!/^((https|http)?:\/\/(?:www\.)?instagram\.com\/(p|tv|reel|stories)\/([^/?#&]+)).*/i.test(url)) throw 'Url invalid'
  let form = new FormData()
  form.append('url', encodeURI(url))
  form.append('action', 'post')
  let res = await fetch('https://snapinsta.app/action.php', {
    method: 'POST',
    headers: {
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary1kCNm4346FA9yvCN',
      'cookie': 'PHPSESSID=6d7nupv45th6ln9ldhpu62pg8s; _ga=GA1.2.1450546575.1637033620; _gid=GA1.2.1378038975.1637033620; _gat=1; __gads=ID=68a947f8174e0410-22fc6960b3ce005e:T=1637033620:RT=1637033620:S=ALNI_MbXTvxtxuISyAFMevds6-00PecLlw; __atuvc=1%7C46; __atuvs=61932694ba428f79000; __atssc=google%3B1',
      'origin': 'https://snapinsta.app',
      'referer': 'https://snapinsta.app/id',
      'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
      ...form.getHeaders()
    },
    body: form
  })
  let html = await res.text()
  const $ = cheerio.load(html)
  let results = []
  $('div.col-md-4').each(function () {
    let thumbnail = $(this).find('div.download-items > div.download-items__thumb > img').attr('src')
    let result = $(this).find('div.download-items > div.download-items__btn > a').attr('href')
    if (!/https?:\/\//i.test(result)) result = 'https://snapinsta.app' + result
    results.push(result)
  })
  if (results.length !== 0) return {
    username: '',
    dl: results,
    capt: '',
    server: 0
  }
  else throw false
}

async function ig(url) {
  let res = await fetch(global.API('lolhuman', '/api/instagram', {
    url
  }, 'apikey'))
  let json = await res.json()
  if (json.result) return {
    dl: json.result,
    username: '',
    capt: '',
    server: 1
  }
  else throw false
}

async function ig2(url) {
  let res = await fetch(global.API('lolhuman', '/api/instagram2', {
    url
  }, 'apikey'))
  let json = await res.json()
  let result = json.result
  if (result.media) return {
    dl: result.media,
    username: result.account.username || '',
    capt: result.caption || '',
    server: 2
  }
  else throw false
}
async function igreel(url) {
  let res = await fetch(global.API('lolhuman', '/api/instagramreel', {
    url
  }, 'apikey'))
  let json = await res.json()
  let result = json.result.link
  if (result) return {
    dl: result.link,
    username: result.owner || '',
    capt: result.title || '',
    server: 'Reel'
  }
  else throw false
}