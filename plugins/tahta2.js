let handler = async (m, { conn, text }) => {
  if (!text) throw `_Masukkan Teks!_\n\nContoh:\n${usedPrefix}tahta2 nayla`
  await conn.sendFile(m.chat, global.API('lolhuman', '/api/hartatahta', { text, }, 'apikey'), 'Harta Tahta.png', 'Done', m)
}
handler.help = ['tahta2 <nama>']
handler.tags = ['maker']
handler.command = /^tahta2$/i
handler.limit = true

module.exports = handler