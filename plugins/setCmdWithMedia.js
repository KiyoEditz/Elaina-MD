const max = 20
module.exports = Object.assign(async function handler(m, { text, isPrems, isROwner }) {
    if (!isPrems) {
        global.dfail('premium', m, conn)
        throw false
    }
    let users = db.data.users[m.sender]
    if (users.amount_cmd >= max) throw `Sudah mencapai maksimal`
    global.db.data.sticker = global.db.data.sticker || {}
    if (!m.quoted) throw 'Reply Pesan!'
    if (!m.quoted.fileSha256) throw 'SHA256 Hash Missing'
    if (!text) throw `Tidak ada teks`
    let sticker = global.db.data.sticker
    let hash = Buffer.from(m.quoted.fileSha256).toString('hex')
    if (sticker[hash] && sticker[hash].locked) throw 'You have no permission to change this sticker command'
    sticker[hash] = {
        text,
        mentionedJid: m.mentionedJid,
        creator: m.sender,
        at: + new Date,
        locked: false,
    }
    if (!isROwner) {
        if (!('amount_cmd' in users)) users.amount_cmd = 1
        else users.amount_cmd += 1
    }
    m.reply(`Done!\nTersisa ${max - users.amount_cmd}`)
}, {
    help: ['cmd'].map(v => 'set' + v + ' <text>'),
    tags: ['cmd'],
    command: ['setcmd']
})
