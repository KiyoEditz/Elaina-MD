let fetch = require('node-fetch')
let handler = async (m, { text }) => {
    if (!text) throw `_Masukkan keyword!_`
    let res = await fetch(global.API('pencarikode', '/kbbi', { kata: text }, 'APIKEY'))
    if (!res.ok) throw 'Server Error.. Harap lapor owner'
    let json = await res.json()
    let list = json.kata.list.map((v, i) => `${i + 1}. ${v}`).join('\n')
    m.reply(`${json.kata.word}
    
${list}
`.trim())
}
handler.help = ['kbbi <teks>']
handler.tags = ['belajar']
handler.command = /^kbbi$/i
handler.disabled = true
module.exports = handler
