module.exports = Object.assign(async function handler(m, { text, isPrems }) {
    if (!isPrems) {
        global.dfail('premium', m, conn)
        throw false
    }
    let hash = text
    if (m.quoted && m.quoted.fileSha256) hash = Buffer.from(m.quoted.fileSha256).toString('hex')
    if (!hash) throw `Tidak ada hash`
    let sticker = global.db.data.sticker
    let creator = db.data.users[sticker[hash].creator].amount_cmd
    if (sticker[hash] && sticker[hash].locked) throw '_Command ini telah dikunci_\n\nTidak dapat menghapus'
    if (creator) creator++
    else creator = 0
    delete sticker[hash]
    m.reply(`Done!`)
}, {
    help: ['cmd'].map(v => 'del' + v + ' <text>'),
    tags: ['cmd'],
    command: ['delcmd']
})