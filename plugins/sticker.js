const { sticker } = require('../lib/sticker')
const WSF = require('wa-sticker-formatter')
let handler = async (m, { conn, args, usedPrefix, command }) => {
    let stiker = false
    let wsf = false
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (/webp/.test(mime)) {
            let img = await q.download()
            if (!img) throw `balas stiker dengan perintah ${usedPrefix + command}`
            wsf = new WSF.Sticker(img, {
                pack: global.packname,
                author: global.author,
                crop: false,
            })
        } else if (/image/.test(mime)) {
            let img = await q.download()
            if (!img) throw `balas gambar dengan perintah ${usedPrefix + command}`
            wsf = new WSF.Sticker(img, {
                pack: global.packname,
                author: global.author,
                crop: false,
            })
        } else if (/video/.test(mime)) {
            if ((q.msg || q).seconds > 11) throw 'Maksimal 10 detik!'
            let img = await q.download()
            if (!img) throw `balas video dengan perintah ${usedPrefix + command}`
            stiker = await sticker(img, false, global.packname, global.author)
        } else if (args[0]) {
            if (isUrl(args[0])) stiker = await sticker(false, args[0], global.packname, global.author)
            else throw 'URL tidak valid!'
        }
    } catch (e) {
        throw e
    }
    finally {
        if (wsf) {
            await wsf.build()
            const sticBuffer = await wsf.get()
            if (sticBuffer) await conn.sendMessage(m.chat, { sticker: sticBuffer }, {
                quoted: m,
                mimetype: 'image/webp',
                ephemeralExpiration: 86400
            })
        }
        if (stiker) await conn.sendMessage(m.chat, { sticker: stiker }, {
            quoted: m,
            mimetype: 'image/webp',
            ephemeralExpiration: 86400
        })
        // else throw `Gagal${m.isGroup ? ', balas gambarnya!' : ''}`
    }
}
handler.help = ['stiker (caption|reply media)']
handler.tags = ['sticker']
handler.command = /^(s(tic?ker)?(gif)?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

const isUrl = (text) => {
    return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}
