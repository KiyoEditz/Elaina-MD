let handler = async (m, { conn, usedPrefix: _p }) => {

  let capt = `
===================
Kode Aktivasi Group
===================
1. Silver [gratis]\nBot aktif trial selama 3 hari https://wa.me/${conn.user.jid.split('@')[0]}?text=.claim+kode
2. Gold
Harga:\n- Pengguna baru: Rp. 5000\n- Perpanjang: Rp. 3000\nMasa aktif: 30 Hari
3. Diamond
Harga:\n- Pengguna baru: Rp. 8000\n- Perpanjang: Rp. 5000\nMasa aktif: 60 Hari

Fitur Bot Untuk Group:
• Hidetag, mentionAll member
• Welcome, Bye, antidelete [on/off]
• Group [open/close]
• Fitur game [on/off]
  
===================
MEMBER PREMIUM 
===================
[30 Hari] *Harga:*
- Pengguna baru: Rp. 10.000
- Perpanjang: Rp. 8.000

Apa yang kamu dapatkan jika premium?
• Fitur Limit tanpa batas
• Klaim lebih banyak XP Harian
• Dapatkan hingga 5 kode redeem group
• Fitur JadiBot
• Dan masih banyak lagi`.trim()

  let msg = await m.reply(capt)
  setTimeout(() => {
    conn.reply(m.chat, `Bagaimana? sudah menentukan pilihan kamu?? kalau udah yuk gass joinn\n${_p}owner\n${_p}payment`, msg)


  })
}
handler.help = ['sewabot', 'premium']
handler.tags = ['main', 'group']
handler.command = /^(sewa(bot)?|premium)$/i

module.exports = handler