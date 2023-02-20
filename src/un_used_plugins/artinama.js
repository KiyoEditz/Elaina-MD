// let fetch = require('node-fetch')
// let handler = async (m, { conn, text, usedPrefix }) => {
//   if (!text) throw `_Masukkan nama!_\nContoh:\n\n${usedPrefix}artinama susanto`
//   let res = await fetch(global.API('http://nzcha-apii.herokuapp.com', '/artinama', {
//     nama: text
//   }))
//   if (!res.ok) throw 'Server Error.. Harap lapor owner'
//   let json = await res.json()
//   m.reply(json.result.trim())
// }
// handler.help = ['artinama <nama>']
// handler.tags = ['fun']

// handler.command = /^(artinama)$/i

// module.exports = handler