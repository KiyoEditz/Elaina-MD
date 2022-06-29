const axios = require('axios')
const cheerio = require('cheerio')

let handler = async (m, { conn, args }) => {
  if (!(/^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/i.test(args[0]))) throw 'Masukan username tanpa @'
  let res = await igstalk(args[0])
  let json = JSON.parse(JSON.stringify(res))
  let {
    fullname,
    username,
    posts,
    postsM,
    followers,
    followersM,
    followingM,
    following,
    bio,
    photo_profile,
  } = json
  let caption = `
*Nama :* ${fullname} 
*Usernamee :* (@${username})
*Link :* instagram.com/${username}
*Post(s) :* ${posts} (${postsM})
*Following :* ${following} (${followingM})
*Followers :* ${followers} (${followersM})
*Bio :*
${bio}
`.trim()
  conn.sendFile(m.chat, photo_profile, 'ppig.jpg', caption, m)
}
handler.help = ['igstalk <username>']
handler.tags = ['search']

handler.command = /^(igstalk)$/i

module.exports = handler

async function igstalk(username) {
  try {
    const { data } = await axios.get(`https://dumpor.com/v/${username}`, {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
        "cookie": "yuidss=27908061654918351; yandexuid=27908061654918351; i=xf9t861U10TjlsxcMQGq4rqc85SnhmZXW46mrbxRRXjX2rfo/Es3LHvowEdjFYEfH8aiGdWaL9hOub5AfS5bZf1fa/Q=; ymex=1970331113.yrts.1654971113#1970331112.yrtsi.1654971112; yabs-sid=138805171656519319"
      }
    })
    const $ = cheerio.load(data)
    const results = {
      username: ($('#user-page > div.user > div.row > div > div.user__title > h4').text() || '').replace(/@/gi, '').trim(),
      fullname: $('#user-page > div.user > div.row > div > div.user__title > a > h1').text(),
      photo_profile: ($('#user-page > div.user > div.row > div > div.user__img').attr('style') || '').replace(/(background-image: url\(\'|\'\);)/gi, '').trim(),
      bio: $('#user-page > div.user > div.row > div > div.user__info-desc').text(),
      followers: ($('#user-page > div.user > div.row > div > ul > li').eq(1).text() || '').replace(/Followers/gi, '').trim(),
      followersM: ($('#user-page > div.container > div > div > div:nth-child(1) > div > a').eq(2).text() || '').replace(/Followers/gi, '').trim(),
      following: ($('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li').eq(2).text() || '').replace(/Following/gi, '').trim(),
      followingM: ($('#user-page > div.container > div > div > div:nth-child(1) > div > a').eq(3).text() || '').replace(/Following/gi, '').trim(),
      posts: ($('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li').eq(0).text() || '').replace(/Posts/gi, '').trim(),
      postsM: ($('#user-page > div.container > div > div > div:nth-child(1) > div > a').eq(0).text() || '').replace(/Posts/gi, '').trim()
    }
    return results
  } catch (e) {
    console.error(e)
    throw 'Username tidak ditemukan'
  }
}