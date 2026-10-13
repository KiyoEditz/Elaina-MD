let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `• *Format salah!*\n\nContoh: *${usedPrefix + command} @user .menu*`
  let who = m.isGroup ? (m.mentionedJid && m.mentionedJid[0]) : m.chat
  if (!who) throw '• Tag seseorang yang ingin di-sudo!'
  
  let txt = text.trim().replace(/^@\S+\s*/, '').trim()
  if (!txt) throw `• Masukkan perintah yang ingin dijalankan!\nContoh: *${usedPrefix + command} @${who.split('@')[0]} .menu*`

  let msg = await conn.preSudo(txt, who, m)
  conn.ev.emit('messages.upsert', msg)
}

handler.help = ['sudo @user <command>']
handler.tags = ['owner']
handler.command = /^sudo$/i
handler.rowner = true

module.exports = handler
