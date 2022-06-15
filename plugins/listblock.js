let handler = async (m, { conn, isOwner }) => {
    let blocked = conn.blocklist.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)
    conn.reply(m.chat, `╔ *Daftar Terblokir*` + `\n` + blocked.map(v => '║ @' + v.replace(/@.+/, '')).join`\n` + '\n╚════', m, { contextInfo: { mentionedJid: blocked } })
}
handler.help = ['listblock']
handler.tags = ['info']
handler.command = /^(bloc?klist|listbloc?k)$/i

module.exports = handler