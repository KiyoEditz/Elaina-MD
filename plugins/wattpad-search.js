const { searchWattpad } = require('../lib/wattpad');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan judul yang ingin di cari!\n\nContoh:\n${usedPrefix}${command} isekai karbit`;
  }

  try {
    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

    // Mengambil respons dari scraper 
    const response = await searchWattpad(args[0]);
    var { link, image, title, readCount, voteCount, chapterCount, description } = response[0];
     //deskripsi = description.replace(/[^\S\r\n]+/g, '');
        let capt = `╭──── 〔WATTPAD〕 ─⬣\n`;
        capt += ` ⬡ *Title* : ${title}\n`;
        capt += ` ⬡  *View* : ${readCount}\n`;
        capt += ` ⬡  *Vote* : ${voteCount}\n`;
        capt += ` ⬡  *Chapter* : ${chapterCount}\n`;
        capt += ` ⬡  *Url* : ${link}\n`;
        capt += `╰────────⬣\n`;  
        capt += ` ⬡  ${description}\n`;  
        await conn.sendMessage(m.chat, { 
        image: { url: image }, 
        caption: capt
    }, { quoted: m });
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['wattpadsearch'];
handler.command = /^(wattpadsearch|wattpads)$/i;
handler.tags = ['downloader','tools'];
handler.premium = false;

module.exports = handler;