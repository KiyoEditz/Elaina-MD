async function handler(m, { conn, usedPrefix }) {
  let users = [...new Set([...global.conns.filter(conn => conn.user && conn.state !== 'close').map(conn => conn.user)])]
  conn.reply(m.chat, users.map(v => 'wa.me/' + v.jid.replace(/[^0-9]/g, '') + `?text=${usedPrefix}menu @${v.jid.split`@`[0]}`).join('\n'), m, { contextInfo: { mentionedJid: users.map(v => v.jid) } })
  m.reply()
}
handler.command = handler.help = ['listjadibot']
handler.tags = ['info']

module.exports = handler
