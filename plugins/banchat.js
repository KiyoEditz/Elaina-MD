let handler = async (m, { conn, participants }) => {
  if (conn.user.jid !== global.conn.user.jid) {
    if (participants.map(v => v.id).includes(global.conn.user.jid)) throw `Tidak bisa ban, ada bot master disini`
  }
  global.db.data.chats[m.chat].isBanned = true
  m.reply('_*Chat ini telah di banned*_\nBot tidak akan merespon.. \n\nHubungi Owner untuk membuka banned')
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^banchat$/i
handler.owner = true

module.exports = handler
