let fetch = require('node-fetch')
let handler = async (m, { args }) => {
    let res = await fetch(global.API('lolhuman', '/api/freefire/' + args[0], '', 'apikey'))
    let json = await res.json()
    if (!json.status !== 200) throw `Username tidak ditemukan`
    m.reply(`\nnickname : ${json.result}\nID : ${args[0]}\n`)
}
handler.help = ['epep'].map(v => v + ' <id>')
handler.tags = ['search']
handler.command = /^(freefire|epep)$/i
handler.disabled = 1
module.exports = handler