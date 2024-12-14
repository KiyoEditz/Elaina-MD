const threadster = require('../lib/threads.js');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan URL!\n\nContoh:\n${usedPrefix}${command} https://www.threads.net/@kiyoeditz/post/DBM2ZfDhNt1?xmt=AQGzrh-Sij7-wJHJB8vj6q4Gu4plAuy-7IqSgfVMkNePCg`;
  }

  try {
    // Ekstraksi ID dari URL
    let urlMatch = args[0].match(/\/post\/([A-Za-z0-9-_?=]+)$/i);
    if (!urlMatch) throw `URL tidak valid!`;
    let id = urlMatch[0];

    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

    // Mengambil respons dari API Threadster
    const response = await threadster(id);
    let vid = response.content.download.link;

    await m.reply('_Sedang mengirim file..._');

    // Kirim file ke chat
    let fileType = vid.endsWith('.jpg') || vid.endsWith('.jpeg') ? 'image' : 'video';
    await conn.sendFile(
      m.chat,
      vid,
      `threads.${fileType === 'image' ? 'jpg' : 'mp4'}`,
      '',
      m,
      null,
      { asDocument: global.db.data.users[m.sender]?.useDocument || false }
    );
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['threads'];
handler.command = /^(threads)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;

module.exports = handler;
