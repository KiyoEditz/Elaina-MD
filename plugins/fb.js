const fg = require('api-dylux'); 
const fetch = require('node-fetch');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan URL!\n\nContoh:\n${usedPrefix}${command} https://www.facebook.com/share/r/ZM2xDeQdQ5y31jR5/?mibextid=D5vuiz`;
  }
  try {
    if (!args[0].match(/facebook/gi)) {
      throw `Berikan URL dari Facebook!`;
    }
    conn.reply(m.chat, 'Tunggu sebentar...', m); 
    const response = await fg.fbdl(args[0]);
    const { videoUrl, size, title } = response;
    let vid = videoUrl;
    let caption = `⬣───「 *FACEBOOK* 」───⬣
○ Title: ${title}
○ Size: ${size}
○ VideoUrl: ${readMore}
${videoUrl}`;
    await conn.sendFile(m.chat, vid, 'facebook.mp4', caption, m, null, { asDocument: global.db.data.users[m.sender].useDocument });
  } catch (e) {
    throw '*Tidak Dapat Mengambil Informasi Url*';
  }
};

handler.help = ['facebook <url>'];
handler.tags = ['downloader'];
handler.command = /^((facebook|fb)(downloder|dl)?)$/i;
module.exports = handler;

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)