const fetch = require('node-fetch')

let handler = async (m, { conn }) => {
    let res = await fetch(global.API('lolhuman', '/api/random/wallnime', {}, 'apikey'))
    if (!res.ok) throw 'Server Error.. Harap lapor owner'
    let img = await res.buffer()
    conn.senFile(m.chat, img, 'wallnime.jpg', '', m)
}
handler.help = ['wallpaperanime']
handler.tags = ['imagerandom']
handler.command = /^(wallpaper|wp)anime$/i
handler.limit = false

module.exports = handler