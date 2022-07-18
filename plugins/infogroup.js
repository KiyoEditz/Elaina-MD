let handler = async (m, { conn, participants, groupMetadata }) => {
    let pp = './src/avatar_contact.png'
    try {
        pp = await conn.profilePictureUrl(m.chat, 'image')
    } catch (e) {
    } finally {
        let { isBanned, welcome, detect, sWelcome, sBye, sPromote, sDemote, antiLink, stiker, game, delete: del, viewonce } = global.db.data.chats[m.chat]
        const groupAdmins = participants.filter(v => v.Admin).map(v => v.id)
        let listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.split('@')[0]}`).join('\n')
        let text = `*「 Group Information 」*\n
*Name:* 
${groupMetadata.subject}
*ID:* ${groupMetadata.id}
*Total Members:* ${participants.length} Members
*Description:* 
${groupMetadata.desc}

*Group Owner:* @${groupMetadata.owner || m.chat.split`-`[0] || ''}
*Group Admins:*
${listAdmin}

*Group Settings:*
Banned ${isBanned ? '✅' : '❌'}
Welcome ${welcome ? '✅' : '❌'} 
Detect ${detect ? '✅' : '❌'} 
Anti Delete ${del ? '❌' : '✅'} 
Anti Link ${antiLink ? '✅' : '❌'} 
Anti Sekali Lihat ${viewonce ? '✅' : '❌'}
Otomatis Stiker ${stiker ? '✅' : '❌'}
Fitur Game ${game ? '✅' : '❌'}

*Message Settings:*
Welcome: ${sWelcome}
Bye: ${sBye}
Promote: ${sPromote}
Demote: ${sDemote}

*Sisa Masa Aktif Group:*
${conn.msToDate(global.db.data.chats[m.chat].gcdate ? (global.db.data.chats[m.chat].gcdate - new Date() * 1) : '')}
`.trim()
        ownernya = [`${m.chat.split`-`[0]}@s.whatsapp.net`]
        let mentionedJid = groupAdmins.concat(ownernya)
        conn.sendFile(m.key.remoteJid, pp, 'pp.jpg', text, m, false, { contextInfo: { mentionedJid } })
    }
}
handler.help = ['infogrup']
handler.tags = ['group', 'info']
handler.command = /^(gro?upinfo|info(gro?up|gc))$/i
handler.group = true

module.exports = handler