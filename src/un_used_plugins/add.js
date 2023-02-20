// let fetch = require('node-fetch')
// let handler = async (m, { conn, text, participants, usedPrefix, command, isAdmin, isOwner }) => {
//   if (!(isAdmin || isOwner)) {
//     global.dfail('admin', m, conn)
//     throw false
//   }
//   if (!text) throw `_Masukkan nomor!_ \nContoh:\n\n${usedPrefix + command + ' ' + global.owner[2]}`
//   let _participants = participants.map(user => user.id)
//   let users = (await Promise.all(
//     text.split(',')
//       .map(v => v.replace(/[^0-9]/g, ''))
//       .filter(v => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
//       .map(async v => [
//         v,
//         await conn.isOnWhatsApp(v + '@s.whatsapp.net')
//       ])
//   )).filter(v => v[1]).map(v => v[0] + '@c.us')
//   let response = await await conn.groupParticipantsUpdate(
//     m.chat,
//     users,
//     "add" // replace this parameter with "remove", "demote" or "promote"
//   )
//   if (response[users] == 408) throw `_Gagal!_\n\nNomor tersebut telah keluar baru² ini\nHanya bisa masuk lewat *${usedPrefix}link* group`
//   let pp = await conn.profilePictureUrl(m.chat).catch(_ => false)
//   let jpegThumbnail = pp ? await (await fetch(pp)).buffer() : false
//   for (let user of response.participants.filter(user => Object.values(user)[0].code == 403)) {
//     let [[jid, {
//       invite_code,
//       invite_code_exp
//     }]] = Object.entries(user)
//     let teks = `Mengundang @${jid.split('@')[0]} menggunakan invite...`
//     m.reply(teks, null, {
//       contextInfo: {
//         mentionedJid: conn.parseMention(teks)
//       }
//     })
//     await conn.sendGroupV4Invite(m.chat, jid, invite_code, invite_code_exp, false, 'Invitation to join my WhatsApp group', jpegThumbnail ? {
//       jpegThumbnail
//     } : {})
//   }
// }
// handler.help = ['add']
// handler.tags = ['admin']
// handler.command = /^(add|\+)$/i
// handler.group = true
// handler.botAdmin = true
// handler.limit = true

// module.exports = handler

