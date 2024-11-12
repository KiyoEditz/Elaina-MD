/*
const Starlights = require('@StarlightsTeam/Scraper')

let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!args || !args[0]) return conn.reply(m.chat, 'Masukkan URL!\n\nContoh:\n${usedPrefix}${command} https://vt.tiktok.com/ZSFNnpxvP/', m)
  await conn.sendMessage(m.chat, {
    react: { text: '🕒', key: m.key },
  });
try {
let { title, author, duration, views, likes, comment, share, published, downloads, dl_url } = await Starlights.tiktokdl(args[0])
let txt = '`乂  T I K T O K  -  D O W N L O A D`\n\n'
    txt += `	✩  *Title* : ${title}\n`
    txt += `	✩  *Author* : ${author}\n`
    txt += `	✩  *Duration* : ${duration} segundos\n`
    txt += `	✩  *View* : ${views}\n`
    txt += `	✩  *Like* : ${likes}\n`
    txt += `	✩  *Komentar* : ${comment}\n`
    txt += `	✩  *Share* : ${share}\n`
    txt += `	✩  *Tanggal upload* : ${published}\n`
    txt += `	✩  *Total donwload* : ${downloads}\n\n`
    txt += `> 🚩 *${global.footer}*`
await conn.sendFile(m.chat, dl_url, 'tiktok.mp4', txt, m, null, rcanal)
await conn.sendMessage(m.chat, {
  react: { text: '✅', key: m.key },
});
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
*/
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