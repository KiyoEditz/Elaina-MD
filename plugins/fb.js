/*
let { facebookdl, facebookdlv2 } = require('@bochilteam/scraper')
let handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) throw `Masukan link, ketik\n${usedPrefix}fb https//:www.facebook.com/abcdefgabc`
    if (!args[0].match(/https:\/\/.*(facebook.com|fb.watch)/gi)) throw `_link salah_`
    const { result } = await facebookdl(args[0]).catch(async _ => await facebookdlv2(args[0]))

    m.reply('_Sedang proses mengirim..._')
    for (const { url, isVideo } of result.reverse()) conn.sendFile(m.chat, url, `facebook.${!isVideo ? 'bin' : 'mp4'}`, ``, m, false, { asDocument: db.data.users[m.sender].useDocument })

}


handler.help = ['fb <link>']
handler.tags = ['downloadersosmed']
handler.command = /^(f(ace)?b(ook)?(dl)?)$/i

module.exports = handler
*/

const fg = require('api-dylux');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Input link atau reply link yang ingin di download!\n\n*Contoh:*\n${usedPrefix + command} link`;
  }

  let urlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.watch)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
  if (!urlRegex.test(args[0])) {
    throw '⚠️ PLEASE GIVE A VALID URL.';
  }

  conn.reply(`_*Tunggu sedang di proses...*_`);

  try {
    let result = await fg.fbdl(args[0]);
    let text = `
⊱ ─── {*FACEBOOK*} ─── ⊰
↳ *VIDEO TITLE:* ${result.title}
⊱ ────── {⋆♬⋆} ────── ⊰`;

    let response = await fetch(result.videoUrl);
    let arrayBuffer = await response.arrayBuffer();
    let videoBuffer = Buffer.from(arrayBuffer);

    conn.sendFile(m.chat, videoBuffer, 'fb.mp4', text, m);
  } catch (error) {
    console.log(error);
    m.reply('⚠️ An error occurred while processing the request. Please try again later.');
  }
};

handler.help = ['facebook <url>'];
handler.tags = ['downloader'];
handler.command = /^((facebook|fb)(downloder|dl)?)$/i;
module.exports = handler;

