// let fetch = require('node-fetch')
// let handler = async (m, { conn, text, command, usedPrefix }) => {
//     if (!text) throw `_Masukkan keyword!_\nContoh:\n\n${usedPrefix + command} whatsapp`
//     m.reply('Sedang mencarii...')
//     let res = await fetch(global.API('neoxr', '/api/download/apk', {
//         q: text
//     }, 'apikey'))
//     if (!res.ok) throw 'Server Error.. Harap lapor owner'
//     let json = await res.json()
//     if (!json.status) throw `Aplikasi tidak ditemukan`
//     let { name, size, filename, download } = json.data
//     await m.reply(`
// *Name:* ${name}
// *Ukuran:* ${size}
// *Link:* ${download}
// _File sedang dikirim.. mohon tunggu sebentar_
// `.trim())
//     conn.sendFile(m.chat, download, filename, false, m)
// }
// // handler.help = ['apk <keyword>']
// // handler.tags = ['search']
// handler.command = /^(apk)$/i
// handler.disabled = true
// module.exports = handler