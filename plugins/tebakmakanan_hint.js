let handler = async (m, { conn }) => {
    conn.tebakmakan = conn.tebakmakan ? conn.tebakmakan : {}
    let id = 'tebakmakanan-' + m.chat
    if (!(id in conn.tebakmakan)) throw false
    let json = conn.tebakmakan[id][1]
    m.reply('Clue : ' + '' + json.jawaban.replace(/[AIUEOaiueo]/ig, '_') + '' + '\n\n_Jangan Balas Chat Ini Tapi Balas Soalnya_')
}
handler.command = /^temak$/i
handler.limit = true
module.exports = handler