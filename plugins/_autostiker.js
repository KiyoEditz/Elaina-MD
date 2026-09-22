
const { sticker } = require('../lib/sticker')
const WSF = require('wa-sticker-formatter')
let handler = m => m

handler.before = async function (m) {
    let chat = global.db.data.chats[m.chat]
    let user = global.db.data.users[m.sender]

    //Auto stiker
    if (chat.stiker && !user.banned && !chat.isBanned && !m.fromMe && !m.isBaileys) {
        // try {
        if (/^.*s(tic?ker)?(gif)?$/i.test(m.text)) return
        let q = m
        let stiker = false
        let wsf = false
        let mime = (q.msg || q).mimetype || ''
        if (/webp/.test(mime)) return
        if (/image/.test(mime)) {
            let img = await q.download?.()
            if (!img || !Buffer.isBuffer(img) || img.length === 0) return
            try {
                let wsf = new WSF.Sticker(img, {
                    pack: global.packname,
                    author: global.author,
                    type: 'full',
                })
                stiker = await wsf.build()
            } catch (e) {
                console.error('autosticker WSF error:', e)
            }
            if (!stiker || !Buffer.isBuffer(stiker) || !stiker.includes('RIFF')) {
                stiker = await sticker(img, false, global.packname, global.author)
            }
        } else if (/video/.test(mime)) {
            if ((q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!')
            let img = await q.download?.()
            if (!img || !Buffer.isBuffer(img) || img.length === 0) return
            stiker = await sticker(img, false, global.packname, global.author)
        } else if (m.text.split` `[0]) {
            if (isUrl(m.text.split` `[0])) stiker = await sticker(false, m.text.split` `[0], global.packname, global.author)
            else return
        }
        if (stiker && Buffer.isBuffer(stiker) && stiker.length > 0) {
            await this.sendMessage(m.chat, { sticker: stiker }, {
                quoted: m,
                mimetype: 'image/webp',
                ephemeralExpiration: 86400
            })
        }
        // } finally {
        //     if (stiker) {
        //     }
        // }
    }
    return true
}
module.exports = handler

const isUrl = (text) => {
    return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}