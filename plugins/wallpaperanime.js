const { wallpaper } = require('@bochilteam/scraper')
const fetch = require('node-fetch')

let handler = async (m, { conn, text }) => {
    let res = await fetch(global.API('lolhuman', '/wallpaper', { query: text || 'Anime' }, 'apikey'))
    if (!res.ok) throw 'Server Error.. Harap lapor owner'
    let json = await res.json()
    let img = await (json.result.LinkImg).buffer()
    conn.sendFile(m.chat, img, 'wallnime.jpg', '', m)
}
handler.help = ['anime', ''].map(v => 'wallpaper ' + v)
handler.tags = ['imagerandom']
handler.command = /^(wallpaper|wp)$/i
handler.limit = false
handler.disabled = 1
module.exports = handler