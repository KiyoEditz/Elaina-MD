const fs = require('fs')
const fetch = require('node-fetch')
const file_path = 'lib/playlist.json'
let handler = async (m, { conn, text, usedPrefix }) => {
    if (!fs.existsSync(file_path)) fs.writeFileSync(file_path, `{"default":"3AaKHE9ZMMEdyRadsg8rcy",
    "id":""}`)
    let file = JSON.parse(fs.readFileSync(file_path))
    if (!text) {
        file.id = false
        m.reply(`Playlist Di reset!\n\nKetik ${usedPrefix}setplaylist id_playlist_spotify untuk mengubah\nContoh ${usedPrefix}setplaylist 37i9dQZF1DWTwnEm1IYyoj`)
    } else {
        let res = await fetch('https://open.spotify.com/playlist/' + text.trim())
        if (!res.ok) throw 'Server Error.. Harap lapor owner'
    }
    file.id = text.trim()
    fs.writeFileSync(file_path, JSON.stringify(file))
    m.reply('Berhasil mengubah playlist')
}
handler.help = ['setplaylist'].map(v => v + ' <id>')
handler.tags = ['owner']
handler.owner = true
handler.command = /^setplaylist$/i

module.exports = handler