const uploadImage = require('../lib/uploadImage')
let { webp2png } = require('../lib/webp2mp4')
const { sticker } = require('../lib/sticker')

let fetch = require('node-fetch')
let handler = async (m, { conn }) => {

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!(mime || /image\/(jpe?g|png)|webp/.test(mime))) throw `Reply Gambar`
    let img = await q.download()
    m.reply('_Sedang proses mengirim..._')
    let url
    if (/webp/.test(mime)) {
        url = await webp2png(img)
    } else {
        url = await uploadImage(img)
    }
    let res = await fetch(global.API('lolhuman', '/api/convert/imgtopdf', {
        img: url
    }, 'apikey'))
    // if (!res.ok) throw 'Server Error.. Harap lapor owner'
    // let json = await res.json()
    await conn.sendFile(m.chat, res, new Date * 1 + '.pdf', '', m)

}
handler.help = ['imagetopdf', 'topdf'].map(v => v + ' (caption|reply gambar)')
handler.tags = ['maker']
handler.command = /^(ima?ge?)?topdf$/i
handler.limit = true
handler.disabled = 1
module.exports = handler