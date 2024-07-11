const fetch = require('node-fetch');

let handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) throw 'Masukkan link.\nContoh: *.tera https://www.4funbox.com/wap/share/filelist?surl=9JnFO9C3BX-ggDStXMDRkA';
    
    m.reply('Tunggu sebentar...');

    let url = encodeURIComponent(args[0]);
    let apiUrl = `https://xzn.wtf/api/teraboxdl?url=${url}&apikey=mufar`; // Pastikan API key valid

    let res = await fetch(apiUrl);

    if (!res.ok) { // Periksa status respons HTTP
      throw 'Terjadi kesalahan saat mengambil data dari API';
    }

    let json = await res.json();

    if (json.list && json.list.length > 0) {
      let fileInfo = json.list[0];
      let message = `
Nama File: ${fileInfo.filename}
Ukuran File: ${fileInfo.filesize}
Tanggal: ${fileInfo.date}
Tautan Langsung: ${fileInfo.direct_link}
      `;
      await conn.sendMessage(m.chat, { text: message }, { quoted: m }); // Menggunakan sendMessage untuk mengirim pesan teks
    } else {
      throw 'Tidak ada tautan langsung yang ditemukan';
    }
  } catch (error) {
    console.error(error); 
    conn.sendMessage(m.chat, { text: 'Terjadi kesalahan: ' + error.message }, { quoted: m });
  }
};

// ... (bagian lainnya sama)

handler.help = ['terabox'];
handler.tags = ['internet'];
handler.command = /^(tera|terabox)$/i;
handler.limit = true;

module.exports = handler;