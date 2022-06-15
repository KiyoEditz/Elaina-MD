let handler = async (m, { conn, text, usedPrefix, command }) => {
  let fail = `_Fitur ini untuk berbagi Limit ke user lain_\n\ncontoh:\n${usedPrefix + command} @6287857180075 10\natau Reply pesan doi dengan perintah: ${usedPrefix + command} 10`
  let users = db.data.users
  let who
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
  else who = m.chat
  if (!who) return conn.reply(m.chat, fail, m)
  if (!who in users) {
    users[who] = {
      limit: 10,
    }
  }
  let txt = text.replace('@' + who.split`@`[0], '').trim()
  if (!txt) return conn.reply(m.chat, fail, m)
  if (isNaN(txt)) throw 'Hanya angka'
  let lim = parseInt(txt)
  let limit = lim
  if (limit < 1) throw 'Minimal 1'
  if (limit > users[m.sender].limit) throw '_Limit tidak mencukupi untuk mentransfer_'
  users[m.sender].limit -= limit
  users[who].limit += limit

  m.reply(`( -${limit} Limit)`)
  conn.fakeReply(m.chat, `+${limit} Limit`, who, m.text)
}
handler.help = ['paylimit @user [jumlah]']
handler.tags = ['xp']
handler.command = /^(tf|pay)limit$/i

module.exports = handler

