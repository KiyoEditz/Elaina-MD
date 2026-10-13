const axios = require('axios');
const moewalls = require('../lib/moewalls');
const { toVideo } = require('../lib/converter');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `Masukkan teks dan angka dengan pemisah sebagai index\n\nContoh:\n${usedPrefix}${command} elaina|1\n\n *index bisa membanyak hasil yang di temuka.*`;
  }
  let [query, page] = text.split('|');
  query = (query || '').trim();
  page = (page || '1').trim();

  if (!query) {
    throw `Masukkan teks pencarian!\n\nContoh:\n${usedPrefix}${command} elaina|1`;
  }

  // Konversi page ke indeks array (0-based)
  let index = parseInt(page) - 1;
  if (isNaN(index) || index < 0) index = 0;

  try {
    conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

    // Mengambil respons dari scraper dengan target index spesifik agar cepat
    const res = await moewalls(query, { index });

    if (!res.wallpapers || res.wallpapers.length === 0) {
      throw `Wallpaper untuk "${query}" tidak ditemukan!`;
    }

    if (index >= res.wallpapers.length) {
      throw `Index ke-${page} tidak ditemukan! Hanya ada total ${res.wallpapers.length} wallpaper untuk "${query}".\nContoh: ${usedPrefix}${command} ${query}|1`;
    }

    const item = res.wallpapers[index];
    let videoUrl = item.video;
    if (videoUrl && videoUrl.startsWith('/')) {
      videoUrl = 'https://moewalls.com' + videoUrl;
    }

    if (!videoUrl) {
      throw `Video untuk wallpaper "${item.title}" tidak ditemukan atau gagal diambil!`;
    }

    let capt = `╭──── 〔MOEWALLS〕 ─⬣\n`;
    capt += ` ⬡ *Pencarian* : ${res.query}\n`;
    capt += ` ⬡  *Index* : ${res.total}\n`;
    capt += `╰────────⬣\n`;  
    capt += ` ⬡  *Judul* : ${item.title}\n`;
    capt += ` ⬡  *Source* : ${item.source}\n`;
    capt += ` ⬡  *Menampilkan* : ${item.index} - ${res.total}\n`;

    const isWebm = /\.webm($|\?)/i.test(videoUrl);
    let videoPayload;

    if (isWebm) {
      try {
        const response = await axios.get(videoUrl, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });

        // Konversi WebM ke MP4 agar dapat diputar langsung di WhatsApp
        const converted = await toVideo(Buffer.from(response.data), 'webm');
        videoPayload = converted.data;
        setTimeout(() => converted.delete().catch(() => {}), 15000);
      } catch (convErr) {
        console.error('Konversi webm ke mp4 gagal, mengirim sebagai dokumen:', convErr);
        return await conn.sendMessage(m.chat, {
          document: { url: videoUrl },
          mimetype: 'video/webm',
          fileName: `${item.title.replace(/[\\/:*?"<>|]/g, '_')}.webm`,
          caption: capt
        }, { quoted: m });
      }
    } else {
      videoPayload = { url: videoUrl };
    }

    await conn.sendMessage(m.chat, { 
      video: videoPayload, 
      caption: capt,
      mimetype: 'video/mp4'
    }, { quoted: m });
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ['moewalls'];
handler.command = /^(moewalls)$/i;
handler.tags = ['downloader','tools'];
handler.premium = false;

module.exports = handler;