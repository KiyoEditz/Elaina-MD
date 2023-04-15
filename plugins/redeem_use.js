let fs = require('fs')
let json = JSON.parse(fs.readFileSync('./src/group.json'))
let data = JSON.parse(fs.readFileSync('src/code_redeem.json'))

let obj_ = data.group.trial
let objhalf = data.group.half
let obj = data.group.one
let obj2 = data.group.two

let all = obj_.concat(objhalf).concat(obj).concat(obj2)

let handler = async (m, { conn, args, usedPrefix, isOwner, participants, groupMetadata, command }) => {
    if (conn.user.jid !== global.conn.user.jid) {
        if (participants.map(v => v.id).includes(global.conn.user.jid)) throw `Tidak bisa, ada bot master`
    }
    let chat = global.db.data.chats[m.chat]
    let dataJson = {}
    let masa
    if (chat.init) throw `Bot di Group ini sudah status *Aktif*`
    if (chat.trial && obj_.includes(args[0])) return conn.reply(m.chat, `_Group ini sudah bernah trial/aktivasi selama 1 hari_\n\nGunakan lagi setelah ${conn.msToDate(chat.lastUse + 86400000 - new Date * 1)}\n\n Atau bisa juga aktivasi dengan kode premium\nSilahkan hubungi owner untuk mendapatkan/membeli kode redeem`, m)
    if (!args[0]) throw `Masukkan kode redeem`
    if (data.used.includes(args[0])) throw `Kode sudah digunakan, silahkan da[atkan kode baru di Owner`
    if (!all.includes(args[0])) throw 'Kode tidak valid'
    else {
        if (obj_.includes(args[0])) {
            chat.trial = 1
            masa = 3
        }
        if (objhalf.includes(args[0])) masa = 15
        if (obj.includes(args[0])) masa = 30
        if (obj2.includes(args[0])) masa = 60
        await conn.reply(m.chat, `Berhasil aktivasi\nBot akan aktif di *${groupMetadata.subject}* dalam ${masa} Hari`, m)
        chat.gcdate = new Date() * 1 + 86400000 * masa
        dataJson.expired = new Date() * 1 + 86400000 * masa
    }
    dataJson.nama = `${groupMetadata.subject} (${m.chat})`
    dataJson.owner_group = m.chat.split`-`[0]
    dataJson.joiner = m.sender
    chat.init = true
    data.used.push(args[0])
    json.push(dataJson)
    fs.writeFileSync('./src/group.json', JSON.stringify(json))
    fs.writeFileSync('./src/code_redeem.json', JSON.stringify(data))
}
handler.help = ['use']
handler.tags = ['group']
handler.command = /^(use)$/i
handler.group = true
module.exports = handler