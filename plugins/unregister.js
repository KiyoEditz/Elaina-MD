const { createHash } = require('crypto')
let handler = async function (m, { usedPrefix, command }) {
  let user = global.db.data.users[m.sender]
  let time = user.unreg + 86400000
  if (new Date - user.unreg < 86400000) throw `Kamu sudah daftar ulang hari ini\nHitung mundur: ${msToTime(time - new Date())} lagi`
  user.registered = false
  user.unreg = new Date * 1
  m.reply(`${command} berhasil! silahkan Ketik *${usedPrefix}daftar*`)
}
handler.help = ['unregister', 'daftarulang']
handler.tags = ['main']

handler.command = /^daftarulang|unreg(ister)?$/i
handler.register = true

module.exports = handler

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100)
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return hours + " jam " + minutes + " menit"
}