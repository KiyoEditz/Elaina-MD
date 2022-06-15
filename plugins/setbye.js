let handler = async (m, { conn, text, isROwner, isOwner, command, usedPrefix }) => {
  if (/@user/i.test(text)) {
    if (isROwner && /global/i.test(command)) global.conn.bye = text
    else if (isOwner && /global/i.test(command)) conn.bye = text
    else global.db.data.chats[m.chat].sBye = text
    m.reply('Bye berhasil diatur\nNote:\n@user = (Mention/tag)')
  } else throw `_Masukkan teks!_\n\nMasukan kata kunci berikut ini\nBot akan mengikuti *nama user secara otomatis*\n\n@user (Mention/tag)\n\nContoh:\n${usedPrefix + command} Selamat tinggal @user`
}
handler.help = ['setbye', 'setbyeglobal'].map(v => v + ' <teks>')
handler.tags = ['group']
handler.admin = true
handler.command = /^setbye(global)?$/i
module.exports = handler

