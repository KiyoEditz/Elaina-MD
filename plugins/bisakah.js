let handler = async (m, { conn, text }) => {
  conn.reply(m.chat, `
*Pertanyaan:* ${m.text}
*Jawaban:* ${conn.pickRandom(['Iya', 'Bisa', 'Tentu saja bisa', 'Tentu bisa', 'Sudah pasti', 'Sudah pasti bisa', 'Tidak', 'Tidak bisa', 'Tentu tidak', 'tentu tidak bisa', 'Sudah pasti tidak'])}
`.trim(), m)
}
handler.help = ['bisakah <pertanyaan>']
handler.tags = ['kerang']
handler.customPrefix = /^(..?)?bisakah$/i

handler.disabled = true
module.exports = handler