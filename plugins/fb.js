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

const fg = require('api-dylux'); // Pastikan package ini terinstal dan up-to-date
const fetch = require('node-fetch'); // Tambahkan library node-fetch jika belum ada

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan link atau reply link yang ingin diunduh!\n\n*Contoh:*\n${usedPrefix + command} link`;
  }

  // Perbaiki regex untuk menangani fb.watch dan URL yang lebih beragam
  let urlRegex = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:facebook\.com|fb\.watch)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
  if (!urlRegex.test(args[0])) {
    throw '⚠️ URL TIDAK VALID.'; // Pesan error lebih jelas
  }

  conn.reply(`_*Tunggu sedang diproses...*_`);

  try {
    let result = await fg.fbdl(args[0]);

    // Cek apakah hasil unduhan valid
    if (!result || !result.videoUrl) {
      throw '⚠️ Video tidak ditemukan atau tidak dapat diunduh.';
    }

    // Format informasi video lebih rapi
    let text = `
*FACEBOOK DOWNLOADER*

*Judul:* ${result.title}
*URL:* ${result.videoUrl}
    `;

    // Gunakan node-fetch untuk streaming video secara langsung (lebih efisien)
    conn.reply(m.chat, await fetch(result.videoUrl), 'fb.mp4', text, m); 
  } catch (error) {
    console.error(error);
    let errorMessage = '⚠️ Terjadi kesalahan saat mengunduh video.';

    // Berikan pesan error lebih spesifik jika ada
    if (error.message) {
      errorMessage += `\n\nDetail: ${error.message}`;
    }

    m.reply(errorMessage);
  }
};

handler.help = ['facebook <url>'];
handler.tags = ['downloader'];
handler.command = /^((facebook|fb)(downloder|dl)?)$/i;
module.exports = handler;

