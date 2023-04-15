let handler = async (m, { conn }) => {
    conn.sendFile(m.chat, 'https://telegra.ph/file/055edd68d70d701168122.jpg', 'img.jpg', `
╔══「 *Pembayaran* 」
╟
╟ Go-Pay/Dana/Shoope-pay:
╟ 0819-9928-4127
╟ Pulsa AXIS: 
╟ 0831-9656-4521 (+5000)
╟ 
╚════════════════ 
_Jika sudah melakukan pembayaran harap hubungi Owner_

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