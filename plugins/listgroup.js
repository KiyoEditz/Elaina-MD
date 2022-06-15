let handler = async (m, { conn }) => {
  let now = new Date() * 1
  let gc = conn.chats.all().filter(v => v.jid.endsWith('g.us'))
  let txt = gc.map(v => `${conn.getName(v.jid)}\n${v.jid} [${v.read_only ? 'Keluar' : 'Masuk'}]\n*Masa Aktif:* ${global.db.data.chats[v.jid] === undefined ? '' : global.db.data.chats[v.jid].permanent ? 'Permanent' : global.db.data.chats[v.jid].gcdate == 0 ? 'Tidak terdaftar' : global.db.data.chats[v.jid].gcdate < now ? 'Habis' : clockString(global.db.data.chats[v.jid].gcdate - now)}`).join`\n\n`
  conn.reply(m.chat, `_Daftar Group yang telah di join oleh Bot_\n${txt}`, m)
}
handler.help = ['groups', 'listgroup']
handler.tags = ['info']
handler.command = /^((list)(g(c|roups?))|group(s|list))$/i

module.exports = handler

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / (3600000 * 24))
  let h = isNaN(ms) ? '--' : Math.floor((ms % 86400000) / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return `${d} Hari, ${h} Jam ${m} menit ${s} detik`
}
