let { facebookdl, facebookdlv2 } = require('@bochilteam/scraper')
let handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) throw `Masukan link, ketik\n${usedPrefix}fb https//:www.facebook.com/abcdefgabc`
    if (!args[0].match(/https:\/\/.*(facebook.com|fb.watch)/gi)) throw `_link salah_`
    const { result } = await facebookdl(args[0]).catch(async _ => await facebookdlv2(args[0]))

    m.reply('_Sedang proses mengirim..._')
    for (const { url, isVideo } of result.reverse()) conn.sendFile(m.chat, url, `facebook.${!isVideo ? 'bin' : 'mp4'}`, ``, m, false, { asDocument: db.data.users[m.sender].useDocument })

}


handler.help = ['fb <link>']
handler.tags = ['downloadersosmed']
handler.command = /^(f(ace)?b(ook)?(dl)?)$/i

module.exports = handler