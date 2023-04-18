const translate = require('translate-google-api')
const defaultLang = 'en'
const tld = 'cn'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let err = `
Contoh:
${usedPrefix + command} <kodebahasa> <text>
${usedPrefix + command} id Aku manusia 

Kodebahasa Populer 
id: Indonesia
en: English
`.trim()

    let lang = args[0]
    let text = args.slice(1).join(' ')
    if ((args[0] || '').length !== 2) {
        lang = defaultLang
        text = args.join(' ')
    }
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text

    let result
    try {
        result = await translate(`${text}`, {
            tld,
            to: lang,
        })
    } catch (e) {
        result = await translate(`${text}`, {
            tld,
            to: defaultLang,
        })
        return conn.reply(m.chat, err, + `\n\nDaftar bahasa yang didukung *${usedPrefix}kodebahasa*`, m)
    } finally {
        m.reply(result[0])
    }

}
handler.help = ['translate'].map(v => v + ' <lang> <teks>')
handler.tags = ['tools']
handler.command = /^(tr(anslate)?)$/i
handler.limit = false
handler.fail = null
handler.exp = 0
module.exports = handler
