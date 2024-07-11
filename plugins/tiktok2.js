/*
const { tiktokdl } = require('@bochilteam/scraper')
let fetch = require('node-fetch')

let handler = async (m, { conn, args, usedPrefix, command, isPrems }) => {
  let link = /https?:\/\/(www\.|v(t|m)\.|t\.)?tiktok\.com\/./i
  if (!(link.test(args[0]) && args[0])) throw `Contoh\n\nKetik ${usedPrefix}tiktok https://vm.tiktok/blbala`
  let tt = await tiktokdl(args[0])
    .catch(e => { throw `Error tidak diketahui` })
  let { nickname, avatar, unique_id } = tt.author
  let vid = tt.video.no_watermark

  let mp3 = /musi[ck]/i.test(command)
  if (!mp3) {
    if (!isPrems) m.limit = true
    await m.reply('_Sedang proses mengirim..._')
  }
  await conn.sendFile(m.chat, vid, (new Date * 1) + (mp3 ? '.mp3' : '.mp4'), (mp3 ? '' : `@${unique_id}\n${nickname}`), m, null, { asDocument: global.db.data.users[m.sender].useDocument, mimetype: (mp3 ? 'audio/mpeg' : null) })
  if (!mp3) {
    conn.reply(m.chat, 'Mau ambil lagu nya?\nKetik .tomp3 ', m)
  }
}
handler.help = ['tiktok', 'tiktokmusic'].map(v => v + ' <link>')
handler.tags = ['downloadersosmed']
handler.command = /^(t(ik)?t(ok)?2?)(musi[ck])?$/i

module.exports = handler
*/
let fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Masukkan URL!\n\nContoh: ${usedPrefix + command} https://tiktok.com/xxx`;

  try {
    conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key },
    });

    let tt = await fetch(global.API('alya', 'api/tiktok', { url: text }, 'apikey'));
    let res = await tt.json();

    // Periksa apakah res.data ada dan merupakan array
    if (!res.data || !Array.isArray(res.data)) {
      throw 'Format data tidak valid atau tidak ada video yang ditemukan.';
    }

    let { title, duration, music_info, author, data } = res;

    // Temukan video tanpa watermark jika ada
    let vid = data.find(v => v.type == 'nowatermark')?.url;

    // Jika tidak ada video tanpa watermark, ambil video pertama
    if (!vid) {
      vid = data[0]?.url; // Gunakan optional chaining untuk keamanan
    }

    // Handle jika tidak ada video sama sekali
    if (!vid) {
      throw 'Tidak ada video yang ditemukan.';
    }

    var hasil = `⬣───「 *TIKTOK* 」───⬣
○ Username: ${author.nickname} 
○ NicknameID: @${author.fullname}
○ Duration: ${duration}
○ Description: ${title}

`;

    conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key },
    });

    await conn.sendFile(m.chat, vid, '', hasil, m);
  } catch (error) {
    console.error(error);
    throw 'Tidak Dapat Mengambil Informasi URL atau terjadi kesalahan lainnya.';
  }
};

handler.command = handler.help = ['tt', 'tiktok'];
handler.tags = ['downloader'];

module.exports = handler;
