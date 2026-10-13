let handler = async (m, { conn, text, usedPrefix, command }) => {
  let fail = `_Fitur ini untuk berbagi Limit ke user lain_\n\ncontoh:\n${usedPrefix + command} @6287857180075 10\natau Reply pesan doi dengan perintah: ${usedPrefix + command} 10`
  let users = global.db.data.users
  
  // 1. Ambil JID user (bisa JID biasa maupun LID)
  let who
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : false)
  else who = m.chat
  if (!who) return conn.reply(m.chat, fail, m)

  // 2. Ambil nomor asli penerima & pengirim
  let targetNumberJid = conn.getJid(who) || who
  let mentionMatch = text.match(/@(\d+)/)
  if (who.endsWith('@lid') && mentionMatch && mentionMatch[1].length >= 8) {
    targetNumberJid = mentionMatch[1] + '@s.whatsapp.net'
    if (global.db?.data?.lid) global.db.data.lid[who] = targetNumberJid
    if (conn.isLid) conn.isLid.set(who, targetNumberJid)
  }

  let senderNumberJid = conn.getJid(m.sender) || m.sender
  if (targetNumberJid === senderNumberJid) throw 'Tidak bisa mentransfer ke diri sendiri!'

  // 3. Parse jumlah Limit
  let txt = text.replace(/@[\w.-]+/g, '').trim()
  if (!txt) return conn.reply(m.chat, fail, m)
  if (isNaN(txt)) throw 'Hanya angka'
  let limit = parseInt(txt)
  if (isNaN(limit) || limit < 1) throw 'Minimal 1'

  // 4. Pastikan data user ada di database
  if (!users[senderNumberJid]) {
    users[senderNumberJid] = { exp: 0, limit: 20, name: m.name || '', role: 'Beginner' }
  }
  if (!users[targetNumberJid]) {
    users[targetNumberJid] = { exp: 0, limit: 20, name: conn.getName(targetNumberJid) || '', role: 'Beginner' }
  }

  if (limit > (users[senderNumberJid].limit || 0)) throw '_Limit tidak mencukupi untuk mentransfer_'

  // 5. Transfer ke database dengan nomor asli
  users[senderNumberJid].limit -= limit
  users[targetNumberJid].limit = (users[targetNumberJid].limit || 0) + limit

  // 6. Notifikasi: JID tetap dipakai untuk display/fakeReply di WhatsApp
  m.reply(`( -${limit} Limit)`)
  conn.fakeReply(m.chat, `+${limit} Limit`, who, m.text)
}
handler.help = ['paylimit @user [jumlah]']
handler.tags = ['xp']
handler.command = /^(tf|pay)limit$/i

module.exports = handler

