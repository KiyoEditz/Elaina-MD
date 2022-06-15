/*
   Silahkan Di Pakek
   Tapi Bantu Rapihin :v
   Buatan: Miaweers
*/

let handler = async (m, { conn, participants }) => {
  let prem = global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)
  let users = global.db.data.users
  conn.reply(m.chat, `「 List User Premium 」\n\nTotal: ${prem.length}\n\n` + prem.map((v, i) => i + 1 + `. ${participants.some(p => v === p.jid) ? `(${users[v].name}) wa.me/${v.split`@`[0]}` : `${users[v].name}`}` + `\n*Tersisa:* ${users[v] === undefined ? '' : users[v].premdate < new Date() * 1 ? 'Habis' : clockString(users[v].premdate - new Date() * 1)}`).join`\n\n`,
    m, { contextInfo: { mentionedJid: prem } })
}
handler.help = ['premlist']
handler.tags = ['owner']
handler.command = /^(listprem(ium)?|prem(ium)?list)$/i

module.exports = handler

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / (3600000 * 24))
  let h = isNaN(ms) ? '--' : Math.floor((ms % 86400000) / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return `${d} Hari, ${h} Jam ${m} menit ${s} detik`
}