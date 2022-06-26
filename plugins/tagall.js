let handler = async (m, { conn, text, participants, usedPrefix, isAdmin, isOwner }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }
  if (!text) throw `Silahkan masukan pesan anda\nContoh Ketik ${usedPrefix}tagall Hai`

  let users = participants.map(u => conn.decodeJid(u.id))
  let teks = '╔══「 *TAG ALL* 」\n║ *Dari:* ' + `@${m.sender.split`@`[0]}` + '\n║ *Pesan:* ' + text + '\n║ \n' + users.map(v => '╟ @' + v.replace(/@.+/, '')).join`\n` + '\n╚════════════════'
  conn.reply(m.chat, teks, m, {
    mentions: users
  })
}
handler.help = ['tagall']
handler.tags = ['group']
handler.command = /^tagall$/i

handler.premium = false
handler.group = true
handler.limit = true

module.exports = handler