let handler = async (m, { conn }) => {
    conn.sendFile(m.chat, 'foto QRIS', 'img.jpg', `
╔══「 *Pembayaran* 」
╟
╟ Dana:
╟ 0821-8152-3670
╟ go-pay:
╟ *segera*
╟ Pulsa indosat: 
╟ 0858-7406-8202 (+2000)
╟ Pulsa XL:
╟ 0877-9196-6892 (+5000)
╟ 
╚════════════════ 
_Jika sudah melakukan pembayaran harap hubungi Owner_

*QRIS belum di buat*
Cara scan QRIS
${conn.readmore}
1. Download gambar di atas
2. Buka aplikasi E-Waalet kamu(Ovo, Shopeepay dll)
3. Pilih tab *Bayar*, maka akan di arahkan ke opsi kamera
4. Pilih icon galery di pojok, lalu pilih kode yg sudah didownload
5. Masukkan nominal
6. Pembayaran berhasil`, m)
}
handler.command = /^payment$/i

module.exports = handler