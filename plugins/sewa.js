let handler = async (m, { conn, usedPrefix }) => {

  const sections = [
    {
      "title": "Kode reedem Aktivasi Group",
      "rows": [
        {
          "title": "Silver",
          "description": "Gratis\nBot aktif trial selama 3 hari",
          "rowId": `${_p}say https://wa.me/${conn.user.jid.split('@')[0]}?text=.claim+kode`,
        },
        {
          "title": "Gold",
          "description": "Harga:\n- Pengguna baru: Rp. 5000\n- Perpanjang: Rp. 3000\nMasa aktif: 15 Hari",
          "rowId": `${_p}payment`,
        },
        {
          "title": "Diamond",
          "description": "Harga:\n- Pengguna baru: Rp. 8000\n- Perpanjang: Rp. 5000\nMasa aktif: 30 Hari",
          "rowId": `${_p}payment`,
        }
      ]
    },
    {
      "title": "Member Premium",
      "rows": [
        {
          "title": "30 Hari",
          "description": `*Harga:*
        - Pengguna baru: Rp. 20.000
        - Perpanjang: Rp. 15.000
      *Fitur:*
      • Limit tanpa batas
      • Klaim lebih banyak XP Harian
      • Dapatkan hingga 5 kode redeem group
      • Bisa membuat/mengubah watermark stiker
      • Dan masih banyak lagi`.trim(),
          "rowId": `${_p}payment`,
        },
      ]
    }
  ]

  return await conn.sendMessage(m.chat, {
    text: `*Fitur:*
  • Hidetag, mentionAll member
  • Welcome, Bye, antidelete (on/off)
  • Group (open/close)
  • Fitur game (on/off)`.trim(),
    title: 'Price List LevBot',
    buttonText: "Klik disini",
    sections
  }, { quoted: m })
}
handler.help = ['sewabot', 'premium']
handler.tags = ['main', 'group']
handler.command = /^(sewa(bot)?|premium)$/i

module.exports = handler