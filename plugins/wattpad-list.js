const { listRead } = require('../lib/wattpad');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan URL yang ingin dilihat chapter-nya!\n\nContoh:\n${usedPrefix}${command} https://www.wattpad.com/story/327597340`;
  }

  try {
    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

    // Mengambil respons dari scraper
    const response = await listRead(args[0]);
    const { synopsis, chapters } = response;

    let capt = `⬣──── 〔WATTPAD〕 ─⬣\n`;
    capt += `⬡ *Sinopsis*: ${synopsis}\n\n`;
    capt += `⬡ *Daftar Chapter:*\n`;
    chapters.forEach((chapter, index) => {
      capt += `\n⬡ Chapter ${index + 1}:\n`;
      capt += `  ⬣ *Judul*: ${chapter.title}\n`;
      capt += `  ⬣ *Tanggal*: ${chapter.date}\n`;
      capt += `  ⬣ *Link*: ${chapter.link}\n`;
    });

    await conn.sendMessage(m.chat, { text: capt }, { quoted: m });
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['wattpadlist'];
handler.command = /^(wattpadlist|wattpadl)$/i;
handler.tags = ['downloader', 'tools'];
handler.premium = false;

module.exports = handler;