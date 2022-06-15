let handler = function (m) {
  if (!m.quoted) throw '_Reply pesan bot_'
  let { fromMe, id, isBaileys } = m.quoted
  if (/Broadcast/i.test(m.quoted.text)) throw 'Tidak bisa menghapus pesan broadcast!'
  if (!fromMe && isBaileys) return
  if (!fromMe) throw 'Hanya bisa menghapus pesan dari bot'
  if (!isBaileys) throw 'Pesan tersebut bukan dikirim oleh bot'
  this.deleteMessage(m.chat, {
    fromMe,
    id,
    remoteJid: m.chat
  })
}
handler.help = ['delete']
handler.tags = ['main']

handler.command = /^del(ete)?$/i
handler.admin = false

module.exports = handler
