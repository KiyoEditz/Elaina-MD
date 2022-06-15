let fetch = require('node-fetch')
let handler = async (m, { conn }) => {
    let res = await fetch(global.API('lolhuman', '/api/random/ppcouple', '', 'apikey'))
    let json = await res.json()
    let { male, female } = json.result
    await conn.sendFile(m.chat, male, 'male.jpg', '1', m)
    conn.sendFile(m.chat, female, 'female.jpg', '2', m)
}
handler.help = ['ppcouple']
handler.tags = ['imagerandom']

handler.command = /^(pp)?couple$/i

module.exports = handler