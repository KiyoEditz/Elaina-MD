let { facebook } = require('../lib/scrape')
let handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) throw `Masukan link, ketik\n${usedPrefix}fb https//:www.facebook.com/abcdefgabc`
    if (!args[0].match(/https:\/\/.*(facebook.com|fb.watch)/gi)) throw `_link salah_`
    let res = await facebook(args[0])
    if (!res.status) return 'Error'
    m.reply('_Sedang proses mengirim..._')
    for (let u of res.data) {
        await conn.sendFile(m.chat, u.url, 'facebook.mp4', '', m, null, { asDocument: global.db.data.users[m.sender].useDocument })
    }
}
handler.help = ['fb <link>']
handler.tags = ['downloadersosmed']
handler.command = /^(f(ace)?b(ook)?(dl)?)$/i

module.exports = handler