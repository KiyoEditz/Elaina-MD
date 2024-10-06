const { tiktokdl } = require('tiktokdl');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan URL!\n\nContoh:\n${usedPrefix}${command} https://vt.tiktok.com/ZSFNnpxvP/`;
  }
  try {
    if (!args[0].match(/tiktok/gi)) {
      throw `Berikan URL dari TikTok!`;
    }
    conn.reply(m.chat, wait, m);
    const response = await tiktokdl(args[0]);
    const { video, music } = response;
    await conn.sendFile(m.chat, video, 'tiktok.mp4', '*TikTok Video Downloader*', m, null, { asDocument: global.db.data.users[m.sender].useDocument});
    await conn.sendFile(m.chat, music, 'lagu.mp3', '*TikTok Music Downloader*', m, null, { asDocument: global.db.data.users[m.sender].useDocument});
  } catch (e) {
    throw `Error: ${eror}`;
  }
};

handler.help = ['tiktok'];
handler.command = /^(tiktok|tt)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;

module.exports = handler;