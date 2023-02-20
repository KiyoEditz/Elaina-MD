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