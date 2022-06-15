let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!teks) throw `Ketik ${usedPrefix + command} <teks|author(opt)>`
    await conn.sendFile(m.chat, global.API('lolhuman', '/api/quotemaker', { text }, 'apikey'), 'qmaker.jpg', 'Saat nya update story :/', m)

}
handler.help = ['quotemaker <teks>']
handler.tags = ['maker']
handler.command = /^(quotemaker)$/i
handler.limit = true

module.exports = handler