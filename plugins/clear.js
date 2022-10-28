const delay = ms => new Promise(r => setTimeout(r, ms))
let handler = async (m, { conn, command, args }) => {
  let chats
  if (/group|gc/i.test(args[0])) chats = conn.chats.array.filter(v => v.jid.endsWith('g.us') && !v.pin).map(v => v.jid)
  else if (/chat|private/i.test(args[0])) chats = conn.chats.array.filter(v => v.jid.endsWith('.net') && !v.pin).map(v => v.jid)
  else if (/all/i.test(args[0])) chats = conn.chats.array.filter(v => v.jid && !v.pin).map(v => v.jid)
  else if (/left/i.test(args[0])) chats = conn.chats.array.filter(v => v.read_only).map(v => v.jid)
  else chats = [m.chat]
  let isDelete = /^(delete)/i.test(command)
  let isClear = /^(clear)/i.test(command)
  for (let id of chats) {
    if (isDelete || isClear) await conn.chatModify(id, (isDelete ? 'delete' : 'clear'), {
      includeStarred: false
    }).catch(console.log)
    else if (/unmute/i.test(command)) await conn.chatModify({ mute: null }, id, []).catch(console.log)
    else await conn.chatModify({ mute: 8 * 60 * 60 * 1000 }, id, []).catch(console.log)
    delay(1500)
  }
  conn.reply(m.chat, chats.length + ` chat ${args[0] ? args[0] : ''} telah dib` + ((isDelete || isClear) ? 'ersihkan' : 'isukan selamanya'), m)
}
handler.help = [
  'clearchat',
  'clearchat chat',
  'clearchat group',
  'clearchat all',
  'deletechat',
  'deletechat chat',
  'deletechat group',
  'deletechat all',
  'mutechat',
  'mutechat chat',
  'mutechat group',
  'mutechat all',
  'unmute',
  'unmute chat',
  'unmute group',
  'unmute all'
]
handler.tags = ['owner']
handler.command = /^(clear|delete|(un)?mute)chat$/i
handler.owner = true

module.exports = handler