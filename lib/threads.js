const threadster = require('../lib/threads.js');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan URL!

Contoh:
${usedPrefix}${command} https://www.threads.net/@kiyoeditz/post/DBM2ZfDhNt1?xmt=AQGzrh-Sij7-wJHJB8vj6q4Gu4plAuy-7IqSgfVMkNePCg`;
  }

  try {
    // Ekstraksi ID dari URL
    let urlMatch = args[0].match(/\/post\/([A-Za-z0-9-_]+)(\?.*)?$/i);
    if (!urlMatch || !urlMatch[1]) throw `URL tidak valid! Pastikan URL mengandung ID post.`;
    let id = urlMatch[1];

    // Beri notifikasi kepada pengguna bahwa proses sedang berjalan
    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

    // Panggil fungsi threadster untuk mendapatkan data
    const response = await threadster(id);

    if (response.error) {
      throw `Gagal mengambil data dari Threadster: ${response.message || 'Unknown error'}`;
    }

    // Validasi apakah link download ada
    let vid = response.content?.download?.link;
    if (!vid) {
      throw `Gagal menemukan tautan unduhan dalam data yang diambil.`;
    }

    // Notifikasi pengiriman file
    await m.reply('_Sedang mengirim file..._');

    // Tentukan tipe file berdasarkan ekstensi URL
    let fileType = vid.endsWith('.jpg') || vid.endsWith('.jpeg') ? 'image' : 'video';
    let fileName = `threads.${fileType === 'image' ? 'jpg' : 'mp4'}`;

    // Kirim file ke pengguna
    await conn.sendFile(
      m.chat,
      vid,
      fileName,
      '',
      m,
      null,
      { asDocument: global.db.data.users[m.sender]?.useDocument || false }
    );
  } catch (e) {
    // Tangani error dan beri informasi kepada pengguna
    throw `Terjadi kesalahan: ${e.message || e}`;
  }
};

handler.help = ['threads'];
handler.command = /^(threads)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;

module.exports = handler;
