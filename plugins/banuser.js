let acc = {}
let handler = (m, { conn, text, args, isROwner, usedPrefix }) => {
    let [who, time, reason] = text.split('|')
    if (!isROwner) {
        if (!(time && who && reason)) throw `Masukkan waktu dan alasan\n\nContoh:\n${usedPrefix}ban nomor/tag/reply|day|alasan`
    }
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : who ? (who.replace(/[^0-9]/g, '')) + '@s.whatsapp.net' : false
    else who = who ? (who.replace(/[^0-9]/g, '')) + '@s.whatsapp.net' : m.chat
    if (!who) throw 'Tag salah satu orang'
    let users = global.db.data.users
    if (!(who in users)) users[who] = {
        banned: false
    }
    if (!isROwner) {
        acc[who] = {
            from: m.sender.split`@`[0],
            who: who.split`@`[0], reason, time
        }
        conn.reply(global.owner[0] + '@s.whatsapp.net', `*REQ BAN*\n(${db.data.users[m.sender].name})\n${Object.entries(acc[who]).map(v => `*${v[0][0].toUpperCase() + v[0].substring(1)}:* ${v[1]}`).join('\n')}`)
        m.reply(`_Permintaan banned telah di kirim ke owner utama_\nSilahkan tunggu persetujuan dari Owner Utama`)
        return !0
    }
    users[who].banned = true
    users[who].bannedreason = reason
    users[who].bannedtime = (new Date * 1) + 86400000 * (time || 1)
    m.reply(`_*Kontak tersebut telah berhasil dibanned*_\nBot tidak akan merespon nomor tersebut selama ${conn.msToDate(users[who].bannedtime - new Date * 1)}.. \n\nHubungi Owner untuk membuka banned`)
}
handler.help = ['ban @user']
handler.tags = ['owner']
handler.command = /^ban$/i
handler.owner = true

// handler.before = async function (m, { isROwner }) {
//     if (!isROwner) return
//     if (/ban/i.test(m.text) || /REQ BAN/i.test(m.quoted.text)) {
//         m.reply('Berhasil accept ban')
//     }
// }
module.exports = handler