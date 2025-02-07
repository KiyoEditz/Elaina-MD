const BAVoice = require('../lib/voiceba'); // Import library

let handler = async (m, { conn, usedPrefix, command }) => {
  // Inisialisasi instance BAVoice
  const a = new BAVoice();

  try {
    // Panggil fungsi blueArchiveVoice dengan parameter yang sesuai
    const result = await a.blueArchiveVoiceData({
      text: 'あなたのペニスは小さいです', // Teks input
      model: 'Zunko', // Model suara
      speed: 1.2, // Kecepatan suara
    });

    // Kirim hasil suara ke chat
    await conn.sendMessage(m.chat, result, m);
  } catch (e) {
    // Tangkap error dan log ke konsol
    console.error('Error while generating voice:', e);
    await conn.reply(m.chat, 'Maaf, terjadi kesalahan saat memproses suara.', m);
  }
};

// Menentukan bantuan, command, dan tag
handler.help = ['bavoice *Reply video/audio*'];
handler.command = ['bavoice', 'bluearchivevoice'];
handler.tags = ['ai'];

// Mengekspor handler
module.exports = handler;
