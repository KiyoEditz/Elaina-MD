const { createHash } = require('crypto')
let handler = async function (m, { usedPrefix, command }) {
  let user = global.db.data.users[m.sender]
  let time = user.unreg + 86400000
  if (new Date - user.unreg < 86400000) throw `Kamu sudah daftar ulang hari ini\nHitung mundur: ${conn.clockString(time - new Date())} lagi`
  user.registered = false
  user.unreg = new Date * 1
  m.reply(`${command} berhasil! silahkan Ketik *${usedPrefix}daftar*`)
}
handler.help = ['unregister', 'daftarulang']
handler.tags = ['main']

handler.command = /^daftarulang|unreg(ister)?$/i
handler.register = true

module.exports = handler