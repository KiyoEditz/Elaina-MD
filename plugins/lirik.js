/*
const { lyrics, lyricsv2 } = require('@bochilteam/scraper');
const fetch = require('node-fetch');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `Gunakan contoh ${usedPrefix}${command} NamaPenyanyi NamaLagu\n*${usedPrefix}${command} one direction story of my life*`;

  try {
    const artistAndSong = args.join(' ');
    let result;

    try {
      result = await lyricsv2(artistAndSong);
    } catch (err1) {
      try {
        result = await lyrics(artistAndSong);
      } catch (err2) {
        const server = await fetch(`https://vihangayt.me/search/lyrics?q=${encodeURIComponent(artistAndSong)}`);
        const data = await server.json();

        if (!data.status) {
          if (data.data && data.data.error) {
            conn.reply(m.chat, `Tidak dapat menemukan lirik. ${data.data.error}`, m);
            return;
          } else {
            throw 'Gagal mendapatkan lirik lagu.';
          }
        }

        const { artist, lyrics, title } = data.data;

        conn.reply(m.chat, `
Lyrics *${title}*
Artist ${artist}

${lyrics}
      `.trim(), m);
        return;
      }
    }

    conn.reply(m.chat, `
Lyrics *${result.title}*
Author ${result.author}

${result.lyrics}

Url ${result.link}
    `.trim(), m);

  } catch (error) {
    console.error('Error:', error);
    conn.reply(m.chat, `Terjadi kesalahan saat memproses permintaan. ${error}`, m);
  }
};

handler.help = ['lirik'].map(v => v + ' <Apa>');
handler.tags = ['internet'];
handler.command = /^(lirik|lyrics|lyric)$/i;

module.exports = handler;
*/
const { lyrics } = require('../lib/lyrics'); 

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `Gunakan\n• contoh:\n*${usedPrefix}${command} NamaPenyanyi NamaLagu*\n*${usedPrefix}${command} one direction story of my life*`;

  try {
    const artistAndSong = args.join(' ');
    let searchResults = await lyrics.search(artistAndSong);

    if (!searchResults || searchResults.length === 0) {
      throw 'Lagu tidak ditemukan. Silakan coba lagi dengan kata kunci yang lebih spesifik.';
    }

    const selectedResult = searchResults[0]; // Ambil hasil pertama dari pencarian
    const songDetails = await lyrics.getLyrics(selectedResult.link);

    conn.reply(m.chat, `
🔹 *Judul*: ${selectedResult.title}
🔹 *Penyanyi*: ${selectedResult.artist}
🔹 *Album*: ${selectedResult.album}
🔹 *Tahun*: ${songDetails.year}
🔹 *URL*: ${selectedResult.link}

🎵 *Lirik*: 
${songDetails.lyrics}
    `.trim(), m);
  } catch (error) {
    console.error('Error:', error);
    conn.reply(m.chat, `Terjadi kesalahan saat memproses permintaan atau lirik tidak di temuka: ${error.message}`, m);
  }
};

handler.help = ['lirik'].map(v => v + ' <Apa>');
handler.tags = ['internet'];
handler.command = /^(lirik|lyrics|lyric)$/i;

module.exports = handler;