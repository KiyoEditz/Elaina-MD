let handler = async (m, { conn, usedPrefix }) => {
  conn.sendButton(m.chat, `
*Harga Kode Redeem*
===================
*Silver (Gratis)*
_Bot aktif di group kamu selama 24 Jam_
===================
*Gold*
*Harga:*
  - Pengguna baru: Rp. 5000
  - Perpanjang: Rp. 3000
*Masa aktif:* 15 Hari
===================
*Diamond*
*Harga:*
  - Pengguna baru: Rp. 8000
  - Perpanjang: Rp. 5000
*Masa aktif:* 30 Hari
===================
*Fitur:*
• Hidetag, mentionAll member
• Welcome, Bye, antidelete (on/off)
• Group (open/close)
• Fitur game (on/off)
===================
===================
*Member Premium*
*Harga:*
  - Pengguna baru: Rp. 20.000
  - Perpanjang: Rp. 15.000
*Masa aktif:* 30 Hari / 1 Bulan
*Fitur:*
• Limit tanpa batas
• Klaim lebih banyak XP Harian
• Dapatkan hingga 5 kode redeem group
• Bisa membuat/mengubah watermark stiker
• Bisa menjadi Bot (cloning)
• Dan masih banyak lagi

Sudah tau mau paket apa?
Silahkan klik https://wa.me/${global.owner[2]}?text=Saya+mau+paket+Silver/Gold/Premium+(Pilih+salah+satu)
`, `Pembayaran via pulsa dikenakan biaya tambahan sebesar Rp. 5000`, 'Payment', '.payment', 'Owner', '.owner', m)

}
handler.help = ['sewabot', 'premium']
handler.tags = ['main', 'group']
handler.command = /^(sewa(bot)?|premium)$/i

module.exports = handler