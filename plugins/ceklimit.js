let levelling = require('../lib/levelling')
let handler = async (m, { conn, usedPrefix }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
  let { name, limit, exp, level, role, suit, skata } = global.db.data.users[who]
  let { min, xp, max } = levelling.xpRange(level, global.multiplier)
  let math = max - exp
  conn.reply(m.chat, `
*Nama     :* ${name}
*XP       :* ${exp} (${exp - min}/ ${xp})
[${math <= 0 ? `Siap untuk ${usedPrefix}levelup` : `Butuh ${math} XP lagi untuk levelup`}]
*Level    :* ${level}
*Role     :* ${role}
*Limit    :* ${limit} 
*MMR Total:* ${suit + (skata ? skata : 1)} \n${conn.readmore}
Harga penukaran 1 limit = 350 XP

Cara penukaran: ketik
${usedPrefix}buy

XP bisa kamu dapatkan dengan bermain game Bot di *${usedPrefix}menu game*
`.trim(), m)
}
handler.help = ['cek']
handler.tags = ['xp']
handler.command = /^(cek|limit)$/i
handler.register = true
module.exports = handler