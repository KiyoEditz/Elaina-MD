let fetch = require('node-fetch')
let handler = async (m, { conn, command, args }) => {
  let full = /f$/i.test(command)
  if (!args[0]) return conn.reply(m.chat, '_Masukkan url/link_', m)
  let url = /https?:\/\//.test(args[0]) ? args[0] : 'https://' + args[0]
  let ss = await (await fetch(global.API('nrtm', '/api/ssweb', { delay: 1000, url, full }))).buffer()
  if (ss.status !== 200) throw 'Server Error.. Harap lapor owner'
  conn.sendFile(m.chat, ss, 'screenshot.png', url, m)
}
handler.help = ['ssweb <link>']
handler.tags = ['image']
handler.command = /^ss|ssweb$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

