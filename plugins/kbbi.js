let { kbbi } = require('@bochilteam/scraper')

let handler = async (m, { text }) => {
    if (!text) throw `_Masukkan keyword!_`
    const res = await kbbi(text)
    if (!res.ok) throw 'Server Error.. Harap lapor owner'
    m.reply(`
${res.map(v => `
*📌${v.title}*
${v.means.map(v => '- ' + v).join('\n`')}
`).join('\n').trim()}
Note:
p = Partikel: kelas kata yang meliputi kata depan, kata sambung, kata seru, kata sandang, ucapan salam
n = Nomina: kata benda
`.trim())
}
handler.help = ['kbbi <teks>']
handler.tags = ['belajar']
handler.command = /^kbbi$/i

module.exports = handler
