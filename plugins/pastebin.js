/*
 • Fitur By Anomaki Team
 • Created : Nazand Code
 • Untuk mengambil isi konten pastebin (bagi yang malas ke webnya aja:v) 
 • Dibuat krn malam malam gabut
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
*/

const fetch = require('node-fetch');

const handler = async (m, { args }) => {
  const link = args[0]?.trim();
  if (!link) {
    return m.reply('mana!');
  }
  if (!/^https:\/\/pastebin\.com\/[a-zA-Z0-9]+$/.test(link)) {
    return m.reply('url gk valid');
  }
  const pasteId = link.split('/').pop();
  try {
    const response = await fetch(`https://pastebin.com/raw/${pasteId}`);
    if (!response.ok) throw new Error('Gagal mengambil isi dari Pastebin.');
    const content = await response.text();
    if (!content) {
      return m.reply('Tidak ada isi yang ditemukan di Pastebin!');
    }
    m.reply(`${content}`);
  } catch (error) {
    console.error(error);
    m.reply('Terjadi kesalahan saat mengambil data dari Pastebin.');
  }
};

handler.command = ['getpb','pastebin','getpastebin'];
handler.tags = ['tools'];
handler.help = ['getpb url'];

module.exports = handler;