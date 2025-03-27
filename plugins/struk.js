const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply("Format salah!\nGunakan: .receipt toko|id_transaksi|harga_admin|nomor_tujuan|barang1-harga1,barang2-harga2,Seterusnya\n\n*Example :* .struk2 Abella|1635182|4500|3|Rinso-4000,Royco-2000");

  let [toko, idTransaksi, hargaAdmin, nomorTujuan, items] = text.split("|");  
  if (!toko || !idTransaksi || !hargaAdmin || !nomorTujuan || !items) return m.reply("*Format tidak lengkap*");  

  let daftarBarang = items.split(",").map((item, index) => {  
    let [nama, harga] = item.split("-");  
    return { nomor: index + 1, nama, harga };  
  });  

  const canvasWidth = 400, canvasHeight = 500 + daftarBarang.length * 30;  
  const canvas = createCanvas(canvasWidth, canvasHeight);  
  const ctx = canvas.getContext('2d');  
  
  ctx.fillStyle = "#fff";  
  ctx.fillRect(0, 0, canvas.width, canvas.height);  
  ctx.fillStyle = "#000";  
  ctx.font = "bold 20px monospace";  
  ctx.textAlign = "center";  
  ctx.fillText(toko.toUpperCase(), canvasWidth / 2, 40);  

  ctx.font = "14px monospace";  
  ctx.fillText(new Date().toLocaleString("id-ID"), canvasWidth / 2, 65);  
  ctx.textAlign = "left";  
  ctx.fillText(`ID Transaksi: ${idTransaksi}`, 20, 100);  
  ctx.fillText(`Nomor Tujuan: ${nomorTujuan}`, 20, 125);  
  ctx.beginPath();  
  ctx.moveTo(20, 150);  
  ctx.lineTo(canvasWidth - 20, 150);  
  ctx.stroke();  
  let startY = 175;  
  daftarBarang.forEach((item, i) => {  
    ctx.fillText(`${item.nomor}. ${item.nama} - Rp${parseInt(item.harga).toLocaleString()}`, 20, startY + i * 30);  
  });  
  let lastItemY = startY + daftarBarang.length * 30 + 10;  
  ctx.beginPath();  
  ctx.moveTo(20, lastItemY);  
  ctx.lineTo(canvasWidth - 20, lastItemY);  
  ctx.stroke();  

  let totalHarga = daftarBarang.reduce((sum, item) => sum + parseInt(item.harga), 0);  
  let totalKeseluruhan = totalHarga + parseInt(hargaAdmin);  

  ctx.fillText(`Total: Rp${totalHarga.toLocaleString()}`, 20, lastItemY + 25);  
  ctx.fillText(`Admin: Rp${parseInt(hargaAdmin).toLocaleString()}`, 20, lastItemY + 50);  
  ctx.fillText(`Total Keseluruhan: Rp${totalKeseluruhan.toLocaleString()}`, 20, lastItemY + 75);  

  ctx.font = "bold 14px monospace";  
  ctx.textAlign = "center";  
  ctx.fillText("THANK YOU FOR SHOPPING AT", canvasWidth / 2, lastItemY + 120);  
  ctx.fillText(toko.toUpperCase(), canvasWidth / 2, lastItemY + 140);  

  const buffer = canvas.toBuffer("image/png");  
  const filePath = path.join(__dirname, "../tmp/receipt.png");  
  fs.writeFileSync(filePath, buffer);  

  await conn.sendMessage(m.chat, { image: { url: filePath }, caption: "🧾 *Struk Pembelian*" }, { quoted: m });  

  fs.unlinkSync(filePath);
};

handler.help = ['receipt'];
handler.tags = ['tools'];
handler.command = /^(receipt|struk2?)$/i;

module.exports = handler;