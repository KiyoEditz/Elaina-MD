
let fs = require('fs')
let path = require('path')
const {
    exec,
} = require("child_process")

let handler = async (m, { conn, usedPrefix, command }) => {

    if (!m.quoted) throw `Reply stiker dengan caption *${usedPrefix + command}*`
    const q = m.quoted ? m.quoted : m
    let name = await conn.getName(m.sender)
    let mime = q.mimetype || ''
    if (!/webp/.test(mime)) throw `Reply stiker dengan caption *${usedPrefix + command}*`
    let file = await q.download()
    let media = path.join(__dirname, '../tmp/' + (new Date * 1)) + '.png'
    let filename = media + '.png'

    await fs.promises.writeFile(filename, file)
    m.reply('y')

    exec(`ffmpeg - i ${media} ${filename}`, async (err) => {
        fs.unlinkSync(media)
        if (err) return err
        let buffer = fs.readFileSync(filename)
        await conn.sendFile(m.chat, buffer, filename, '', m)
        fs.unlinkSync(filename)

    })
}
handler.help = ['toimg (reply stiker)']
handler.tags = ['stickertomedia']
handler.command = /^toima?ge?$/i
module.exports = handler
