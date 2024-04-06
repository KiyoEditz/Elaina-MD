let PhoneNumber = require('awesome-phonenumber')
let levelling = require('../lib/levelling')
let handler = async (m, { conn, usedPrefix }) => {
  let pp = false
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
  try {
    pp = await conn.profilePictureUrl(who, 'image')
  } catch (e) {

  } finally {
    let about = (await conn.fetchStatus(who).catch(console.error) || {}).status || ''
    let { name, limit, exp, pasangan, lastclaim, registered, regTime, age, level, role, banned } = global.db.data.users[who]
    if (!(who in global.db.data.users)) throw 'User belum terdaftar'
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let prem = global.prems.includes(who.split`@`[0])
    let jodoh = `Berpacaran @${pasangan.split`@`[0]}`
    let math = max - xp
    let nama = (registered ? name : await conn.getName(who, { withoutContact: true }))
    let str = `
*Nama:* ${nama}${about ? '\nInfo: ' + about : ''}
*Nomor:* https://wa.me/${who.replace(/[^0-9]/g, '')}${registered ? `\n*Umur:* ${age}` : ''}

*Status:*
${registered ? '✅' : '❌'} Terdaftar
${banned ? '✅' : '❌'} DiBanned//Blokir
${prem ? '✅' : '❌'} Premium

*XP:* ${exp} (${exp - min} / ${xp})
[ ${math <= 0 ? `Siap✅ untuk *${usedPrefix}levelup*` : `Butuh ${math} XP lagi untuk levelup`} ]
*Level:* ${level}
*Status:* ${pasangan ? jodoh : 'Jomblo' }
*Role:* ${role}
*Limit:* ${limit}
`.trim()
    if (!(pp == false)) {
      conn.sendFile(m.chat, pp, 'pp.jpg', str, m)
    } else m.reply(str)
  }
}
handler.help = ['profile @user']
handler.tags = ['xp']
handler.command = /^profile?$/i
module.exports = handler

