const { MessageType } = require('@adiwajshing/baileys')
const fetch = require('node-fetch')

let handler = async (m, { conn }) => {
    try {
        let res = await fetch(global.API('lolhuman', '/api/random/wallnime', {}, 'apikey'))
        if (!res.ok) throw 'Server Error.. Harap lapor owner'
        let img = await res.buffer()
        conn.sendMessage(m.chat, img, MessageType.image, {
            quoted: m, caption: 'Hhmm'
        })
    } catch (e) {
        throw ('gagal')
    }
}
handler.help = ['wallpaperanime']
handler.tags = ['imagerandom']
handler.command = /^(wallpaper|wp)anime$/i
handler.limit = false

module.exports = handler