let handler = async (m, { conn }) => {
    conn.siapaaku = conn.siapaaku ? conn.siapaaku : {}
    let id = m.chat
    if (!(id in conn.siapaaku)) throw false
    let json = conn.siapaaku[id][1]
    let nya = json.result.answer
    let nyanya = nya.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
    m.reply('```' + nyanya + '```')
}
handler.command = /^siapasih$/i
handler.limit = true
module.exports = handler 