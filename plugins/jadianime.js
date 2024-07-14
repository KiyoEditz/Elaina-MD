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
    let hasil = await (await fetch(`https://api.lolhuman.xyz/api/imagetoanime?apikey=d5d9e369ab0bf0c231d43b17&img=${url}`)).buffer()
    await conn.sendFile(m.chat, hasil, '', 'Nih Kak, Maaf Kalau Hasilnya Tidak Sesuai Keinginan', m)
    }
handler.help = ['toanime', 'jadianime']
handler.tags = ['anime', 'ai']
handler.command = /^(jadianime|toanime)$/i
handler.premium = true

module.exports =handler