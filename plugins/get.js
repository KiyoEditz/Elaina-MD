const axios = require('axios');
const path = require('path');

const handler = async (m, { text }) => {
    if (!text) return m.reply(`Awali *URL* dengan http:// atau https://`);

    try {
        // Mendapatkan data dari URL
        const response = await axios.get(text, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Referer": "https://www.google.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin",
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
            },
            responseType: 'arraybuffer'
        });

        const contentType = response.headers['content-type'];
        const ext = path.extname(text).toLowerCase();
        console.log(`Content-Type: ${contentType}`);
        console.log(`Ekstensi File: ${ext}`);

        if (/json/i.test(contentType)) {
            // Jika konten adalah JSON
            const jsonData = JSON.parse(Buffer.from(response.data, 'binary').toString('utf8'));
            return m.reply(JSON.stringify(jsonData, null, 2));
        } else if (/text/i.test(contentType)) {
            // Jika konten adalah teks
            const textData = Buffer.from(response.data, 'binary').toString('utf8');
            return m.reply(textData);
        } else if (/image\/webp/i.test(contentType) || ext === '.webp') {
            // Jika konten adalah gambar webp
            return conn.imgToSticker(m.chat, text, m, { packname: "", author: "Hann Universe!!" });
        } else if (/image/i.test(contentType)) {
            // Jika konten adalah gambar
            return conn.sendMessage(m.chat, { image: { url: text } }, { quoted: m });
        } else if (/video/i.test(contentType)) {
            // Jika konten adalah video
            return conn.sendMessage(m.chat, { video: { url: text } }, { quoted: m });
        } else if (/audio/i.test(contentType) || ext === '.mp3') {
            // Jika konten adalah audio
            return conn.sendMessage(m.chat, { audio: { url: text } }, { quoted: m });
        } else {
            // Menangani file lain berdasarkan ekstensi
            const fileName = path.basename(text);
            return conn.sendFile(m.chat, text, fileName, `Berikut adalah file: ${fileName}`, m);
        }
    } catch (error) {
        console.error(`Terjadi kesalahan: ${error}`);
        return m.reply(`Terjadi kesalahan saat mengakses URL: ${error.message}`);
    }
};

handler.help = ['get'];
handler.command = /^(get)$/i;
handler.tags = ['owner', 'tools'];
handler.owner = true;
handler.group = false;
handler.premium = false;

module.exports = handler;