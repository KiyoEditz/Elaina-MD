let { MessageType } = require('@adiwajshing/baileys')

let handler = async (m, { conn, text, participants, usedPrefix, isAdmin, isOwner }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }
  let user = global.db.data.users[m.sender]
  if (!text) throw `Silahkan masukan pesan anda\nContoh Ketik ${usedPrefix}tagall Hai`

  let users = participants.map(u => u.jid)
  let teks = '╔══「 *TAG ALL* 」\n║ *Dari:* ' + `@${m.sender.split`@`[0]}` + '\n║ *Pesan:* ' + text + '\n║ \n' + users.map(v => '╟ @' + v.replace(/@.+/, '')).join`\n` + '\n╚════════════════'
  conn.sendMessage(m.chat, teks, MessageType.extendedText, {
    contextInfo: { mentionedJid: users }

  })
}
handler.help = ['tagall']
handler.tags = ['group']
handler.command = /^tagall$/i

handler.premium = false
handler.group = true
handler.limit = true

module.exports = handler