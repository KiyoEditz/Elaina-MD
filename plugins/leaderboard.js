let handler = async (m, { conn, args, participants, command, usedPrefix }) => {
  let users = Object.entries(global.db.data.users).map(([key, value]) => {
    return { ...value, jid: key }
  })
  let isGC = /g(c|ro?up)/i.test(command)
  if (isGC) users = users.filter(v => participants.some(p => p.id == v.jid))
  let sortedExp = users.map(toNumber('exp')).sort(sort('exp'))
  let sortedLim = users.map(toNumber('limit')).sort(sort('limit'))
  let sortedMmr = users
  .map(user => ({ 
    ...user, 
    MMR: user.suit + (user.skata ? user.skata : 1) 
  }))
  .sort((a, b) => b.MMR - a.MMR); // Urutan dari terbesar ke terkecil, sumpah ribet sialan.
  let sortedLevel = users.map(toNumber('level')).sort(sort('level'))
  let usersExp = sortedExp.map(enumGetKey)
  let usersLim = sortedLim.map(enumGetKey)
  let usersMmr = sortedMmr.map(enumGetKey)
  let usersLevel = sortedLevel.map(enumGetKey)
  let len = args[0] && args[0].length > 0 ? Math.min(100, Math.max(parseInt(args[0]), 5)) : Math.min(5, sortedExp.length)
  let text = `
• *XP Leaderboard ${isGC ? 'Group' : `Top ${len}*`} •
Kamu: *${usersExp.indexOf(m.sender) + 1}* dari *${usersExp.length}*
${sortedExp.slice(0, len).map(({ jid, exp, name }, i) => `${i + 1}. ${participants.some(p => jid === p.id) ? `(${conn.getName(jid)}) wa.me/${jid.split`@`[0]}` : name} *${exp} Exp*`).join`\n`}

• *Limit Leaderboard ${isGC ? 'Group' : `Top ${len}*`} •
Kamu: *${usersLim.indexOf(m.sender) + 1}* dari *${usersLim.length}*
${sortedLim.slice(0, len).map(({ jid, limit, name }, i) => `${i + 1}. ${participants.some(p => jid === p.id) ? `(${conn.getName(jid)}) wa.me/${jid.split`@`[0]}` : name} *${limit} Limit*`).join`\n`}

• *Level Leaderboard ${isGC ? 'Group' : `Top ${len}*`} •
Kamu: *${usersLevel.indexOf(m.sender) + 1}* dari *${usersLevel.length}*
${sortedLevel.slice(0, len).map(({ jid, level, name }, i) => `${i + 1}. ${participants.some(p => jid === p.id) ? `(${conn.getName(jid)}) wa.me/${jid.split`@`[0]}` : name} *Level ${level}*`).join`\n`}

• *MMR Leaderboard ${isGC ? 'Group' : `Top ${len}*`} •
Kamu: *${usersMmr.indexOf(m.sender) + 1}* dari *${usersLevel.length}*
${sortedMmr.slice(0, len).map(({ jid, MMR, name }, i) => `${i + 1}. ${participants.some(p => jid === p.id) ? `(${conn.getName(jid)}) wa.me/${jid.split`@`[0]}` : name} *MMR ${MMR}*`).join`\n`}
`.trim()
  conn.reply(m.chat, text + `\n\nUntuk mengetahui leaderboard group ketik ${usedPrefix}lbgroup`, m, {
    mentions: [...usersExp.slice(0, len), ...usersLim.slice(0, len), ...usersLevel.slice(0, len)].filter(v => !participants.some(p => v === p.id))
  })
}
handler.help = ['leaderboard', 'leaderboardgroup', 'lb'].map(v => v + ' [jumlah]')
handler.tags = ['xp']
handler.command = /^(leaderboard|lb)(g(c|ro?up))?$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0

module.exports = handler

function sort(property, ascending = true) {
  if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
  else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function toNumber(property, _default = 0) {
  if (property) return (a, i, b) => {
    return { ...b[i], [property]: a[property] === undefined ? _default : a[property] }
  }
  else return a => a === undefined ? _default : a
}

function enumGetKey(a) {
  return a.jid
}