let handler = async (m, { conn, text, isROwner, isOwner }) => {
  if (text) {
    global.db.data.chats[m.chat].sWelcome = text
    m.reply('Welcome berhasil diatur\n@user (Mention)\n@subject (Judul Grup)\n@desc (Deskripsi Grup)')
  } else throw '_Masukkan teks!_\n\nMasukan kata kunci berikut ini\nBot akan mengikuti *nama user, group & isi deskripsi secara otomatis*\n\n@user (Mention/teks)\n@subject (Judul Grup)\n@desc (Deskripsi Grup)'
}
handler.help = ['setwelcome <teks>']
handler.tags = ['owner', 'group']

handler.command = /^setwelcome$/i
module.exports = handler


