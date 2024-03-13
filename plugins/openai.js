let fetch = require('node-fetch')

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let teks = text ? text : m.quoted ? m.quoted.text : false
    if (!teks) throw `_Masukkan Prompt_\n\nContoh:\n${usedPrefix + command} Bagaimana biar saya kuat dan tahan lama`

    let openai = await fetch(global.API('alya', 'api/gpt-3.5-turbo', { prompt: teks }, 'apikey'))

    let res = await openai.json()
    if (!res.status) throw `Error :( coba lagi nanti yaa`
    let ai = res.data.content

    await m.reply('AI: ' + ai)
}
handler.help = ['ai'].map(v => v + ' <prompt>')
handler.tags = ['tools']
handler.command = /^ai$/i
handler.limit = true

module.exports = handler