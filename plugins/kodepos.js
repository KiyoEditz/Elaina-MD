let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `_Masukkan zona_\n\nContoh:\n${usedPrefix + command} pare`
    let res = await fetch(global.API('lolhuman', '/api/kodepos', { query: text }, 'apikey'))
    if (!res.ok) throw 'Server Error.. Harap lapor owner'
    let json = await res.json()
    if (json.status !== 200) throw 'Server error..'
    m.reply(json.result.map((v, i) => `${i + 1}. Provinsi: ${v.province}\nKota: ${v.city}\nKecamatan: ${v.subdistrict}\nDesa/Kelurahan: ${v.urban}\nKode Pos: ${v.postalcode}`).join('\n\n'))
}
handler.help = ['kodepos <zona>']
handler.tags = ['tools']
handler.command = /^kodepos$/i

handler.limit = true

module.exports = handler