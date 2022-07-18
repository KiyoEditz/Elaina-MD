let handler = async (m, { conn }) => {
  let now = new Date() * 1
  let gc = Object.values(conn.chats).filter(v => v.id.endsWith('g.us'))
  let txt = gc.map(v => `${v.subject}\n${v.id} [${v.read_only ? 'Keluar' : 'Masuk'}]\n*Masa Aktif:* ${global.db.data.chats[v.id] === undefined ? '' : global.db.data.chats[v.id].permanent ? 'Permanent' : global.db.data.chats[v.id].gcdate == 0 ? 'Tidak terdaftar' : global.db.data.chats[v.id].gcdate < now ? 'Habis' : conn.msToDate(global.db.data.chats[v.id].gcdate - now)}`).join`\n\n`
  conn.reply(m.chat, `_Daftar Group yang telah di join oleh Bot_\n${txt}`, m)
}
handler.help = ['groups', 'listgroup']
handler.tags = ['info']
handler.command = /^((list)(g(c|roups?))|group(s|list))$/i

module.exports = handler