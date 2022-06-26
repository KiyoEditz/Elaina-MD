let handler = (m, { text }) => {
  if (text.length >= 180) throw `Teks kepanjangan`
  let user = global.db.data.users[m.sender]
  user.afk = + new Date
  user.afkReason = text
  let teks = `
  @${m.sender.split`@`[0]} _sekarang AFK/OFF_ ${text ? '\nAlasan: ' + text : ''}
  `.trim()
  m.reply(teks)
}
handler.help = ['afk']
handler.tags = ['main']
handler.command = /^afk$/i

module.exports = handler