const axios = require('axios');

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} minecraft`;

  try {
    conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key },
    });
    conn.reply(m.chat, `_*Tunggu sedang diproses...*_\n\nNote: File terkadang berukuran sangat besar jadi harap bersabar`, m);
    const response = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${text}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${text}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`);
    const results = response.data.resource_response.data.results;
    if (results && results.length > 0) {
      const imageUrls = results.map(v => v.images.orig.url).filter(url => url);
      if (imageUrls.length === 0) {
        throw `Tidak ada gambar yang ditemukan untuk "${text}".`;
      }
      conn.sendMessage(m.chat, {
        react: { text: '✅', key: m.key },
      });
      for (let i = 0; i < imageUrls.length && i < 4; i++) {
        await conn.sendFile(m.chat, imageUrls[i], 'pinterest_image.jpg', '', m);
      }
      conn.reply(m.chat, `_*Hasil dari ${text}*_`, m);
    } else {
      throw `Tidak ada hasil yang ditemukan untuk "${text}".`;
    }
  } catch (error) {
    console.error("Pinterest image retrieval error:", error);
    throw `Gagal mengambil gambar dari Pinterest untuk "${text}".`;
  }
};

handler.help = ['pinterest <keyword>'];
handler.tags = ['image', 'search'];
handler.command = /^(pinterest|pin)$/i;
handler.limit = true;

module.exports = handler;