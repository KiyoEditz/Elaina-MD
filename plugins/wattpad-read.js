const { readWattpad } = require('../lib/wattpad');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `Masukkan Url chapter yang ingin di baca beserta halaman nya.\n\nContoh:\n${usedPrefix}${command} https://www.wattpad.com/791052589-i-am-not-a-lesbian-i-am-not-okay|1`;
  }
   let url = text.split('|')[0]
   let page = text.split('|')[1]
   
  try {
    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

    // Mengambil respons dari scraper 
    const response = await readWattpad(url, page);
    var isi = response;
        capt = `  ${isi}\n`;
        await conn.sendMessage(m.chat, { text: capt }, { quoted: m });
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['wattpadread'];
handler.command = /^(wattpadread|wattpadr)$/i;
handler.tags = ['downloader','tools'];
handler.premium = false;

module.exports = handler;