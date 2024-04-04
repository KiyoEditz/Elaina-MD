let handler = async (m, { conn, usedPrefix }) => {
    m.reply(`
╔══════════════
╟「 *${global.namebot}* 」
┣═══════════════
╟   *Hai ${await conn.getName(m.sender)}*
╟   Terimakasih telah menggunakan *${global.namebot}*
╟   
╟   *Prefix/perintah:* ! # . /
╟   Pilih prefix sesuai kenyamanan mengetik
╟   
╟   ketik *(prefix)help/menu* untuk memulai
╟   Contoh: /help
┣═══════════════
╟   Ketik ${usedPrefix}enable untuk 
╟   mengaktifkan opsi Group
╟  
╟   Ketik ${usedPrefix}bot untuk 
╟   menaktif/nonaktifkan bot untuk Group
╟   
╟   Jadikan bot sebagai admin
╟   agar lebih maksimal (no Kudeta)
╟    ${conn.readmore}
┣═══════════════
╟   *Catatan untuk semua member group*
╟   • Bot ini on always 24 Jam
╟   • Jangan spam bot di group
╟   • Penyalahgunaan bot
╟     pada group ditanggung
╟     member/pengguna
╟   
╟   Disarankan untuk :
╟   • Membisukan notifikasi group
╟   • Mematikan download otomatis,
╟     karena bot ini berpotensi
╟     mengirim banyak media
╟   
╟   Jika ada yang ditanyakan hubungi 
╟   wa.me/${global.nuberowner}
╟   
╟   Sekian, Terimakasih.. Have fun ^_^
╚════════════════
`.trim()) // Tambah sendiri kalo mau
}
handler.help = ['rules']
handler.tags = ['group']
handler.command = /^(rules?)$/i
handler.owner = false
handler.group = true
module.exports = handler