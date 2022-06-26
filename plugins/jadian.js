let R = Math.random
let Fl = Math.floor
let toM = a => '@' + a.split('@')[0]
function handler(m, { participants }) {
    let ps = participants.map(v => v.id)
    let a = ps[Fl(R() * ps.length)]
    let b
    do b = ps[Fl(R() * ps.length)]
    while (b === a)
    m.reply(`${toM(a)} ❤️ ${toM(b)}`, null, {
        contextInfo: {
            mentionedJid: [a, b]
        }
    })
}
handler.help = ['jadian']
handler.tags = ['fun']
handler.command = ['jadian']
handler.group = true
module.exports = handler
