let handler = async (m, { conn }) => {
    conn.tebaksurah = conn.tebaksurah ? conn.tebaksurah : {}
    let id = m.chat
    if (!(id in conn.tebaksurah)) throw false
    let json = conn.tebaksurah[id][1]
    m.reply('*' + json.surah.englishName.replace(/[AIUEOaiueo]/ig, '_') + '*')
}
handler.command = /^hsur$/i

handler.limit = true

module.exports = handler