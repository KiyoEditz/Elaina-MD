/*
const { savefrom, instagramdl } = require('@bochilteam/scraper')
let fetch = require('node-fetch')

let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args[0]) throw `_Masukkan link_\n\nContoh:\n${usedPrefix + command} https://www.instagram.com/p/linkurl`
  if (/stories/i.test(args[0])) throw `_Perintah ini untuk mendownload post IG, bukan story_\nGunakan fitur berikut \n\n${usedPrefix}igstory username`
  if (!args[0].match(/(https:\/\/www.)?instagram.com\/([A-Za-z0-9.\_]*\/)?(reel|p|tv)/)) throw `Link tidak valid \n\nContoh:\n${usedPrefix + command} https://www.instagram.com/p/linkurl`
  let ig = await fetch(global.API('alya', 'api/ig', { url: args[0] }, 'apikey'))
  let res = await ig.json()
  let vid = res.data

  await m.reply('_Sedang proses mengirim..._')

  for (let { type, url } of vid) {
    await conn.sendFile(m.chat, url, 'ig.' + (type == 'image') ? 'jpg' : 'mp4')
      , '', m, null, { asDocument: global.db.data.users[m.sender].useDocument }
  }
}
handler.help = ['ig', 'instagram'].map(v => v + ' <link>')
handler.tags = ['downloadersosmed']
handler.command = /^(ig|instagram)2?$/i
handler.limit = true

module.exports = handler
*/

const axios = require('axios');
const cheerio = require('cheerio');

let handler = async (m, { conn, args, usedPrefix, command, text }) => {
let input = `[!] *wrong input*
	
Ex : ${usedPrefix + command} https://www.instagram.com/reel/CsC2PQCNgM1/?igshid=NTc4MTIwNjQ2YQ==`
if (!text) return m.reply(input)
let no = 1
try {
const { status, media } = await igdl(text);
if (status !== 200) throw eror
await conn.sendMessage(m.chat, {react: {text: '🕐', key: m.key}})
await media.map(v => conn.sendFile(m.sender, v , '', `乂 *I N S T A G R A M*\n\n*Result : ${usedPrefix + command}\n*Url*: ${text}`, m, null, { asDocument: global.db.data.users[m.sender].useDocument }))
await conn.sendMessage(m.chat, {react: {text: '✅', key: m.key}})

 } catch (e) {
 throw eror
 await conn.sendMessage(m.chat, {react: {text: '❎', key: m.key}})
 
 }
}
handler.help = ["ig"]
handler.tags = ['downloader']
handler.command = /^(ig|instagram|igdl)$/i
handler.limit = true

module.exports = handler

async function igdl(url) {
  return new Promise(async (resolve, reject) => {
    const payload = new URLSearchParams(
      Object.entries({
        url: url,
        host: "instagram"
      })
    )
    await axios.request({
      method: "POST",
      baseURL: "https://saveinsta.io/core/ajax.php",
      data: payload,
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        cookie: "PHPSESSID=rmer1p00mtkqv64ai0pa429d4o",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
      }
    })
    .then(( response ) => {      
      const $ = cheerio.load(response.data)
      const mediaURL = $("div.row > div.col-md-12 > div.row.story-container.mt-4.pb-4.border-bottom").map((_, el) => {
        return "https://saveinsta.io/" + $(el).find("div.col-md-8.mx-auto > a").attr("href")
      }).get()
      const res = {
        status: 200,
        media: mediaURL
      }
      resolve(res)
    })
    .catch((e) => {
      console.log(e)
      throw {
        status: 400,
        message: "error",
      }
    })
  })
}