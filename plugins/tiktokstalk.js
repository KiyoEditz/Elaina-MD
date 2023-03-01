let fetch = require('node-fetch')
let handler = async (m, { conn, args }) => {
  try {
    if (!(/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/i.test(args[0]))) throw 'Masukan username tanpa @'
    let res = await fetch(global.API('lolhuman', '/api/stalktiktok/' + args[0], {}
      , 'apikey'))
    if (!res.ok) throw 'Server Error.. Harap lapor owner'
    let json = await res.json()
    if (json.result.error) throw 'Gagal'
    let {
      username,
      nickname,
      video,
      followers,
      followings,
      bio,
      user_picture
    } = json.result
    let pp = user_picture
    let caption = `
*Username:* @${username} ( ${nickname} ) 
*Link :* tiktok.com/${username}
*Post video:* ${video}
*Following :* ${followings}
*Followers :* ${followers}
*Bio :*
${bio}
`.trim()
    if (pp) conn.sendFile(m.chat, pp, 'pptt.jpg', caption, m)
    else m.reply(caption)
  } catch (e) { throw 'Error' }
}
handler.help = ['tiktokstalk <username>']
handler.tags = ['search']

handler.command = /^(tiktokstalk)$/i
module.exports = handler
