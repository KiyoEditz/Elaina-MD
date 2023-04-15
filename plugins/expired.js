let fs = require('fs')
let json = JSON.parse(fs.readFileSync('./src/group.json'))

let handler = async (m, { conn, args, usedPrefix, isOwner, participants, isPrems, command }) => {
    if (conn.user.jid !== global.conn.user.jid) {
        if (participants.map(v => v.id).includes(global.conn.user.jid)) throw `Tidak bisa, ada bot master`
    }

    let chat = global.db.data.chats[m.chat]
    let dataJson = {}
    let masa
    let add = /ext/i.test(command) && isOwner

    if (chat.init && !add) throw `Group ini sudah di inisialiasi`
    if (args[0] && !args[0] == 'permanent' && isNaN(args[0])) throw `hanya angka`
    if (isOwner) masa = args[0] ? args[0] : 30
    else if (isPrems) masa = Math.floor((db.data.users[m.sender].premdate - new Date * 1) / 86400000)
    else masa = 0.5

    if (/permanent/i.test(args[0])) {
        if (!isOwner) throw `Hanya owner yang bisa membuat permanent`
        conn.reply(m.chat, `Berhasil menetapkan permanent untuk *${conn.getName(m.chat)}*\n\nKetik ${usedPrefix}statusgc`, m)
        chat.permanent = true
        chat.gcdate = 0
        dataJson.permanent = true
        dataJson.expired = 0
    } else if (add) {
        if (!args[0]) throw `Masukkan angka`
        if (chat.gcdate == 0) chat.gcdate = new Date() * 1 + 86400000 * 30
        chat.permanent = false
        conn.reply(m.chat, `Berhasil menambah masa aktif untuk * ${conn.getName(m.chat)} * selama ${args[0]} hari\n\nKetik ${usedPrefix}statusgc`, m)
        chat.gcdate += args[0] * 86400000
    } else {
        if (!(isOwner || isPrems)) {
            if (chat.trial) return conn.reply(m.chat, `Group ini sudah pernah trial\nHarap sewa ke owner\n\nHarap sewa ke owner untuk lebih lanjut`, m)
            chat.trial = 1
        }
        chat.gcdate = new Date() * 1 + 86400000 * masa
        dataJson.expired = new Date() * 1 + 86400000 * masa
        conn.reply(m.chat, `Berhasil inisialisasi\nBot akan keluar dari * ${conn.getName(m.chat)} * dalam ${masa} Hari\n\nKetik ${usedPrefix}statusgc`, m)
    }
    dataJson.nama = `${conn.getName(m.chat)}(${m.chat})`
    dataJson.owner_group = m.chat.split`- `[0]
    dataJson.joiner = m.sender
    chat.init = true
    json.push(dataJson)
    fs.writeFileSync('./src/group.json', JSON.stringify(json))
}
handler.help = ['init <hari>']
handler.tags = ['owner']
handler.command = /^(init|ext(end)?)$/i
handler.group = true
handler.premium = true

handler.disabled = 1
module.exports = handler