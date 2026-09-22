const { sticker, addExif } = require('../lib/sticker')
const WSF = require('wa-sticker-formatter')

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let stiker = false
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''

        if (/webp/.test(mime)) {
            let img = await q.download?.()
            if (!img || !Buffer.isBuffer(img) || img.length === 0) {
                throw `Balas stiker dengan perintah *${usedPrefix + command}*`
            }
            try {
                stiker = await addExif(img, global.packname, global.author)
            } catch (e) {
                console.error('addExif error:', e)
            }
            if (!stiker || !Buffer.isBuffer(stiker) || !stiker.includes('RIFF')) {
                try {
                    let wsf = new WSF.Sticker(img, {
                        pack: global.packname,
                        author: global.author,
                        type: 'full'
                    })
                    stiker = await wsf.build()
                } catch (e) {
                    console.error('WSF error on webp:', e)
                }
            }
            if (!stiker || !Buffer.isBuffer(stiker) || !stiker.includes('RIFF')) {
                stiker = await sticker(img, false, global.packname, global.author)
            }
        } else if (/image/.test(mime)) {
            let img = await q.download?.()
            if (!img || !Buffer.isBuffer(img) || img.length === 0) {
                throw `Balas gambar atau kirim gambar dengan caption *${usedPrefix + command}*`
            }
            try {
                let wsf = new WSF.Sticker(img, {
                    pack: global.packname,
                    author: global.author,
                    type: 'full'
                })
                stiker = await wsf.build()
            } catch (e) {
                console.error('WSF error on image, falling back to lib/sticker:', e)
            }
            if (!stiker || !Buffer.isBuffer(stiker) || !stiker.includes('RIFF')) {
                stiker = await sticker(img, false, global.packname, global.author)
            }
        } else if (/video/.test(mime)) {
            if ((q.msg || q).seconds > 11) throw 'Maksimal durasi video 10 detik!'
            let img = await q.download?.()
            if (!img || !Buffer.isBuffer(img) || img.length === 0) {
                throw `Balas video dengan perintah *${usedPrefix + command}*`
            }
            stiker = await sticker(img, false, global.packname, global.author)
        } else if (args[0]) {
            if (isUrl(args[0])) {
                stiker = await sticker(false, args[0], global.packname, global.author)
            } else {
                throw 'URL tidak valid! Harus berakhiran jpg, png, atau gif.'
            }
        } else {
            throw `Kirim gambar/video atau balas media dengan caption *${usedPrefix + command}*`
        }

        if (stiker && Buffer.isBuffer(stiker) && stiker.length > 0) {
            await conn.sendMessage(m.chat, { sticker: stiker }, {
                quoted: m,
                mimetype: 'image/webp',
                ephemeralExpiration: 86400
            })
        } else {
            throw 'Gagal mengonversi media menjadi stiker. Pastikan format didukung dan gambar tidak rusak.'
        }
    } catch (e) {
        throw e
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
    return text && text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}
