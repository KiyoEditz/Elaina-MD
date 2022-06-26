let handler = async (m, { conn, text, participants }) => {
  let member = participants.map(u => u.id)
  let siapa = member[Math.floor(Math.random() * member.length)]
  let jawab = `
*Pertanyaan :* ${m.text}
*Jawaban* : @${siapa.replace(/@.+/, '')}
    `.trim()
  let mentionedJid = [siapa]
  conn.reply(m.chat, jawab, m, { contextInfo: { mentionedJid } })
}
handler.help = ['siapakah <pertanyan?>']
handler.tags = ['kerang']
handler.command = /^siapa(kah)?$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler