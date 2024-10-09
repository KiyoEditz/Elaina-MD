let pajak = 0.02
let handler = async (m, { conn, text, usedPrefix, command }) => {
  let fail = `_Fitur ini untuk berbagi XP ke user lain_\n\ncontoh:\n${usedPrefix + command} @6287857180075 10\natau reply chat user lain dengan perintah: ${usedPrefix + command} 10`
  let users = global.db.data.users
  let who
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
  else who = m.chat
  if (!who) return conn.reply(m.chat, fail, m)
  if (!who in users) {
    users[who] = {
      exp: 0
    }
  }
  let txt = text.replace('@' + who.split`@`[0], '').trim()
  if (!txt) return conn.reply(m.chat, fail, m)
  if (isNaN(txt)) throw 'Hanya angka'
  let xp = parseInt(txt)
  let exp = xp
  let pjk = Math.ceil(xp * pajak)
  exp += pjk
  if (exp < 1) throw 'Minimal 1'
  if (exp > users[m.sender].exp) throw '_Exp tidak mencukupi untuk mentransfer_'
  users[m.sender].exp -= exp
  users[owner[0] + '@s.whatsapp.net'].exp += pjk
  users[who].exp += xp

  m.reply(`(${-xp} XP) + (${-pjk} XP (Pajak 2%)) = ( ${-exp} XP)`)
  conn.fakeReply(m.chat, `+${xp} XP`, who, m.text)
}
handler.help = ['payexp @user <jumlah>']
handler.tags = ['xp']
handler.command = /^payexp$/

module.exports = handler