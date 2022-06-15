let handler = async (m, { command }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let prem = global.prems.includes(who.split`@`[0])

    let date = prem ? global.db.data.users[who].premdate : ''
    let gc = /g(roup|c)/i.test(command)
    if (gc && m.isGroup) {
        who = m.chat
        date = global.db.data.chats[m.chat].gcdate ? global.db.data.chats[m.chat].gcdate : ''
    }
    let permanent = global.db.data.chats[who].permanent || ''
    let now = new Date() * 1
    let distance = date - now
    let time
    if (distance <= 0) time = `Masa aktif habis`
    else time = clockString(distance)
    let str = `
Status : *${(gc && permanent) ? 'Group Permanent' : gc ? 'Sewa' : prem ? 'User Premium' : 'User'}*${(prem || gc) ? '\nTersisa: ' + (permanent ? ' Infinity' : time) : ''}
`.trim()
    m.reply(str)
}
handler.help = ['statusgroup']
handler.tags = ['group']
handler.command = /^(status(g(roup|c))?)$/i
module.exports = handler

function clockString(ms) {
    let d = isNaN(ms) ? '--' : Math.floor(ms / (3600000 * 24))
    let h = isNaN(ms) ? '--' : Math.floor((ms % 86400000) / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return `${d} Hari, ${h} Jam ${m} menit ${s} detik`
}
