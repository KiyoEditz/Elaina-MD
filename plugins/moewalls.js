const moewalls = require('../lib/moewalls');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `Masukkan teks dan angka dengan pemisah sebagai index\n\nContoh:\n${usedPrefix}${command} elaina|1\n\n *index bisa membanyak hasil yang di temuka.*`;
  }
   let url = text.split('|')[0]
   let page = text.split('|')[1] || "1"; // Mengatur default "1" jika bagian kedua kosong

// Konversi page ke indeks array (0-based)
let index = parseInt(page) - 1;

   
  try {
    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

    // Mengambil respons dari scraper 
    const response = await moewalls(url);
    var res = response;
     //deskripsi = description.replace(/[^\S\r\n]+/g, '');
        let capt = `╭──── 〔MOEWALLS〕 ─⬣\n`;
        capt += ` ⬡ *Pencarian* : ${res.query}\n`;
        capt += ` ⬡  *Index* : ${res.total}\n`;
        capt += `╰────────⬣\n`;  
        capt += ` ⬡  *Judul* : ${res.wallpapers[index].title}\n`;
        capt += ` ⬡  *Source* : ${res.wallpapers[index].source}\n`;
        capt += ` ⬡  *Menampilkan* : ${res.wallpapers[index].index} - ${res.total}\n`;
        await conn.sendMessage(m.chat, { 
        video: { url: res.wallpapers[index].video }, 
        caption: capt
    }, { quoted: m });
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['moewalls'];
handler.command = /^(moewalls)$/i;
handler.tags = ['downloader','tools'];
handler.premium = false;

module.exports = handler;