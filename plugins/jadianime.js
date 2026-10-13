const fetch = require('node-fetch')
const uploadImage = require('../lib/uploadImage.js')

let handler = async (m, { conn, usedPrefix, command, text }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let name = await conn.getName(who)
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) throw 'Kirim/Reply Gambar Dengan Caption .toanime'
    m.reply(wait)
    let media = await q.download()
    let url = await uploadImage(media)
    let lolkey = global.lolkey || (global.APIKeys && (global.APIKeys['https://api.lolhuman.xyz'] || global.APIKeys['http://api.lolhuman.xyz'])) || ''
    let hasil = await (await fetch(`https://api.lolhuman.xyz/api/imagetoanime?apikey=${lolkey}&img=${url}`)).buffer()
    await conn.sendFile(m.chat, hasil, '', 'Nih Kak, Maaf Kalau Hasilnya Tidak Sesuai Keinginan', m)
    }
handler.help = ['toanime', 'jadianime']
handler.tags = ['anime', 'ai']
handler.command = /^(jadianime|toanime)$/i
handler.premium = true

module.exports =handler