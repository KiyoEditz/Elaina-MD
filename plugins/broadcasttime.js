let handler = async (m, { conn, text }) => {
  let teks = text ? text : m.quoted ? m.quoted.text : m.text
  let chats = conn.chats.all().filter(v => !v.read_only && v.message && !v.archive).map(v => v.jid)
  let content = await conn.cMod(m.chat, m, teks + '\n「 All Chat Broadcast 」')
  const delay = ms => new Promise(r => setTimeout(r, ms))
  for (let id of chats) {
    await conn.copyNForward(id, content, true)
    await delay(2000)
  }
  conn.reply(m.chat, `_Mengirim pesan broadcast ke ${chats.length} chat_`, m)
}
handler.help = ['broadcastdelay']
handler.tags = ['owner']
handler.command = /^(b(road)?c(ast)?(time|delay))$/i
handler.owner = true
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler