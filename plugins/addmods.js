let fs = require('fs')
let handler = async (m, { conn, args, usedPrefix, command }) => {
    const json = JSON.parse(fs.readFileSync('./src/mods.json'))
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    else who = args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat
    if (json.includes(who.split`@`[0])) throw `${conn.getName(who, { withoutContact: true })} sudah premium!`
    json.push(`${who.split`@`[0]}`)
    fs.writeFileSync('./src/mods.json', JSON.stringify(json))
    m.reply(`${await conn.getName(who, { withoutContact: true })} telah ditunjuk sebagai moderator Bot`)
    delete require.cache[require.resolve('../config')]
    require('../config')
}
handler.help = ['addmods']
handler.tags = ['owner']
handler.command = /^(addmods?)$/i

handler.rowner = true

module.exports = handler
