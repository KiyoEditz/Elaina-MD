let fs = require('fs')
let handler = async (m, { conn, text }) => {
    let json = JSON.parse(fs.readFileSync('./src/premium.json'))
    let who
    delete require.cache[require.resolve('../config')]
    require('../config')
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    else who = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat
    if (json.includes(who)) throw `${conn.getName(who, { withoutContact: true })} belum premium!`
    let index = json.indexOf(who.split`@`[0])
    json.splice(index, 1)
    fs.writeFileSync('./src/premium.json', JSON.stringify(json))
    db.data.users[who].premdate = 0
    m.reply(`${await conn.getName(who, { withoutContact: true })} sekarang bukan premium!`)

    delete require.cache[require.resolve('../config')]
    require('../config')

}
handler.help = ['delprem @user']
handler.tags = ['owner']
handler.command = /^(remove|hapus|-|del)prem$/i

handler.rowner = true

module.exports = handler
