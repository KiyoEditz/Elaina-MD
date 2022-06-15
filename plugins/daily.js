let free = 500
const prem = 20000
let levelling = require('../lib/levelling')

let handler = async (m, { conn, isPrems, isMods, command }) => {
  let users = global.db.data.users[m.sender]
  let { level, exp } = users
  let levelpast = levelling.findLevel(exp)
  let xp = (isPrems ? prem : free) * level / 100 + free
  let xpAfter = (isPrems ? prem : free) * levelpast / 100 + free
  let time = users.lastclaim + ((isPrems || isMods) ? 86400000 : 43200000)
  if (new Date - users.lastclaim < ((isPrems || isMods) ? 86400000 : 43200000)) throw `Kamu sudah mengklaim klaim harian hari ini\ntunggu selama ${msToTime(time - new Date())} lagi`
  if (!users.autolevelup && !/force/i.test(command) && levelling.canLevelUp(users.level, users.exp, global.multiplier)) return conn.sendButton(m.chat, `_Kamu memiliki XP yang cukup untuk menaikan level_ *${level + ' - ' + levelpast}*`, `Naikann level! kamu akan dapat lebih banyak XP setiap claim harian\n\nClaim sekarang : ${xp}\nClaim setelah naik level : ${xpAfter}`, 'Ya, naikan level', '.levelup', 'Tidak, claim biasa', '.claimforce', m)
  if (isPrems) users.limit += 10


  users.exp += xp
  m.reply(`+${xp} XP ${isPrems ? '\n+10 Limit' : ''}`)
  users.lastclaim = new Date * 1
}
handler.help = ['claim', 'daily']
handler.tags = ['xp']
handler.command = /^(daily|claim)(force)?$/i

module.exports = handler

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return hours + " jam " + minutes + " menit"
}