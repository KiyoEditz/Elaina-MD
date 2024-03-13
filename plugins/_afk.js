let handler = m => m
handler.before = function (m) {
  let user = global.db.data.users[m.sender]
  if (user.afk > -1) {
    m.reply(`
Kamu berhenti AFK${user.afkReason ? ' setelah ' + user.afkReason : ''}
Selama ${this.msToDate(new Date - user.afk)} 
`.trim())
    user.afk = -1
    user.afkReason = ''
  }
  let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
  for (let jid of jids) {
    let user = global.db.data.users[jid]
    if (!user) continue
    let afkTime = user.afk
    if (!afkTime || afkTime < 0) continue
    let reason = user.afkReason || 'AFK'
    let teks = `
_@${jid.split`@`[0]} sedang OFF/AFK_

Alasan: ${reason}
Sudah OFF selama: ${this.msToDate(new Date - afkTime)} 
`.trim()
    m.reply(teks, m.chat)
  }
  return true
}

module.exports = handler

