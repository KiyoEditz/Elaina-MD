let handler = async (m, { conn }) => {
  if (global.db.data.chats[m.chat].isBanned == false) throw `_Chat ini aman_`
  global.db.data.chats[m.chat].isBanned = false
  m.reply('_*Berhasil unban*_\nBot akan merespon Chat seperti semula..')
}
handler.help = ['unbanchat']
handler.tags = ['owner']
handler.command = /^unbanchat$/i
handler.owner = true

module.exports = handler
