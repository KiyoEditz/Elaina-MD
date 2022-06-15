let handler = async (m, { conn }) => {
    conn.asahotak = conn.asahotak ? conn.asahotak : {}
    let id = m.chat
    if (!(id in conn.asahotak)) throw false
    let json = conn.asahotak[id][1]
    let nya = json.result.jawaban
    let nyanya = nya.replace(/[AIUIOaiueo]/g, '_')
    m.reply('```' + nyanya + '```')
}
handler.command = /^hintasah$/i
handler.limit = true
module.exports = handler 