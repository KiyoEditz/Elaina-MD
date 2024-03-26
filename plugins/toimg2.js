let fetch = require('node-fetch')

let handler = async (m, { conn, usedPrefix, command }) => {

    if (!m.quoted) throw `Reply stiker dengan caption *${usedPrefix + command}*`
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) throw `balas stiker gif dengan caption *${usedPrefix + command}*`
    let res = await scrap.uploader(await m.quoted.download())
    let out = await fetch(API('alya', '/api/webp-convert', {
        url: res.data.url,
        action: 'webp-to-png'
    }, 'apikey'))
    res = await out.json()
    conn.sendFile(m.chat, res.data.url, '', 'DONE', m)
}
handler.help = ['toimg (reply stiker)']
handler.tags = ['stickertomedia']
handler.command = /^toima?ge?$/i
module.exports = handler
