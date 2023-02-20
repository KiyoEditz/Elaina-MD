// let fetch = require('node-fetch')
// let handler = async (m, { conn, text, command, usedPrefix }) => {
//     if (!text) throw `_Masukkan keyword!_\nContoh:\n\n${usedPrefix + command} whatsapp`
//     m.reply('Sedang mencarii...')
//     let res = await fetch(global.API('neoxr', '/api/download/apkmod', {
//         q: text
//     }, 'apikey'))
//     if (!res.ok) throw 'Server Error.. Harap lapor owner'
//     let json = await res.json()
//     if (!json.status) throw `Aplikasi tidak ditemukan`
//     let { name, developer, version, size, filename, download } = json.data
//     await m.reply(`
// *Name:* ${name}
// *Dev:* ${developer}
// *Ver:* ${version}
// *Ukuran:* ${size}
// *Link:* ${download}
// `.trim())
//     conn.sendFile(m.chat, download, filename, false, m)
// }
// // handler.help = ['apkmod <keyword>']
// // handler.tags = ['search']
// handler.command = /^(modapk|apkmod)$/i
// handler.disabled = true
// module.exports = handler