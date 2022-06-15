let fetch = require('node-fetch')
let handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) throw `Uhm...url nya mana?\nKetik ${usedPrefix}twitter linknya`
  let res = await fetch(global.API('lolhuman', '/api/twitter2', { url: args[0] }, 'apikey'))
  res2 = await res.json()
  for (let u of res2.result.link) {

    await conn.sendFile(m.chat, u.url, 'twitter.mp4', '', m, null, { asDocument: global.db.data.users[m.sender].useDocument })
  }
}
handler.help = ['twitter <link>']
handler.tags = ['downloadersosmed']

handler.command = /^twitter$/i

module.exports = handler

let axios = require('axios')
let cheerio = require('cheerio')

function twitter(url) {
  return new Promise(async (resolve) => {
    try {
      let form = new URLSearchParams
      form.append('twitter_url', url)
      form.append('submit', 'submit')
      let html = await (await axios.post('https://downloader4twitter.com/', form)).data
      let $ = cheerio.load(html)
      let data = []
      $('div.search-form-output').find('img').each((i, e) => !/thumb/.test($(e).attr('src')) ? data.push({ type: 'jpg', url: $(e).attr('src') }) : '')
      $('div.search-form-output').find('a.btn-download').each((i, e) => data.push({ type: 'mp4', url: $(e).attr('onclick').match(/("(.*?)")/)[2] }))
      if (data.length == 0) return resolve({ creator: '@neoxrs – Wildan Izzudin', status: false })
      return resolve({ creator: '@neoxrs – Wildan Izzudin', status: true, data })
    } catch (e) {
      console.log(e)
      return resolve({ creator: '@neoxrs – Wildan Izzudin', status: false })
    }
  })
}
