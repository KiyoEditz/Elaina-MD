
let { webp2png } = require('../lib/webp2mp4')
let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted) throw `Reply stiker dengan caption *${usedPrefix + command}*`
    const q = m.quoted ? m.quoted : m
    let name = await conn.getName(m.sender)
    let mime = q.mimetype || ''
    if (!/webp/.test(mime)) throw `Reply stiker dengan caption *${usedPrefix + command}*`
    let media = await q.download()
    let out = await webp2png(media).catch(_ => null) || Buffer.alloc(0)
    await conn.sendFile(m.chat, out, 'out.png', '', m)
}
handler.help = ['toimg (reply stiker)']
handler.tags = ['stickertomedia']
handler.command = /^toima?ge?$/i
module.exports = handler
