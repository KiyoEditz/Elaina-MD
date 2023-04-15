let levelling = require('../lib/levelling')

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]

  if (!levelling.canLevelUp(user.level, user.exp, global.multiplier)) {
    let { min, xp, max } = levelling.xpRange(user.level, global.multiplier)

    throw `
Kamu sekarang Level *${user.level} (${user.exp - min}/${xp})*
Kurang *${max - user.exp}* lagi untuk levelup
`.trim()
  }
  let before = user.level * 1
  while (levelling.canLevelUp(user.level, user.exp, global.multiplier)) user.level++


  if (before !== user.level) {
    conn.reply(m.chat, `
Selamat, anda telah naik level!
*${before}* -> *${user.level}*
Reward: Claim lebih banyak XP Harian seiring naiknya level 
Role kamu sekarang: *${user.role}*
	`.trim(), m)
  }
}

handler.help = ['levelup']
handler.tags = ['xp']

handler.command = /^levelup$/i

module.exports = handler
