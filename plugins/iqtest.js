let handler = async (m, { conn, isOwner }) => {
  conn.reply(m.chat, `${isOwner ? `IQ ${m.mentionedJid[0] ? 'Dia' : 'Kamu'} Tidak Terbatas!` : `IQ Anda Sebesar: ${Math.floor(Math.random() * 1000)}`}`, m)
}
handler.help = ['iqtest']
handler.tags = ['fun']
handler.command = /^iqtest$/i

module.exports = handler