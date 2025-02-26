const { pixeldrain } = require('../lib/pixeldrain.js');
const fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*🚨 Contoh:* ${usedPrefix}${command} https://pixeldrain.com/u/Un6ru7VS`;

    try {
        // Ekstrak ID file dari URL
        const fileId = pixeldrain.extractLink(text);
        if (!fileId) throw `*🚨 Format link tidak valid!*\nGunakan link seperti: https://pixeldrain.com/u/Un6ru7VS`;

        // Ambil informasi file dari PixelDrain
        const res = await pixeldrain.dl(fileId);
        if (!res || !res.success) throw `*🚨 Gagal mengambil informasi file!*`;

        // Pastikan file bisa diunduh
        if (!res.can_download) throw `*🚨 File ini tidak tersedia untuk diunduh!*`;

        // Filter berdasarkan MIME type
        const allowedMimeTypes = ['video/mp4', 'image/png', 'image/jpeg', 'application/zip', 'application/pdf'];
        if (!allowedMimeTypes.includes(res.mime_type)) throw `*🚨 Format file tidak didukung!*\nJenis file: ${res.mime_type}`;

        let msg = `📥 *P I X E L D R A I N  D O W N L O A D E R*\n\n`;
        msg += `📌 *Nama:* ${res.name}\n`;
        msg += `📌 *Ukuran:* ${(res.size / (1024 * 1024)).toFixed(2)} MB\n`;
        msg += `📌 *Tipe:* ${res.mime_type}\n`;
        msg += `📌 *Upload:* ${res.date_upload}\n`;
        msg += `📌 *Unduhan:* ${res.downloads}\n`;
        msg += `📌 *Terakhir Dilihat:* ${res.date_last_view}\n`;
        msg += `📌 *Link:* ${text}\n`;

        // Kirim thumbnail jika tersedia
        if (res.thumbnail_href) {
            await conn.sendFile(m.chat, `https://pixeldrain.com/api${res.thumbnail_href}`, 'thumb.png', msg, m);
        } else {
            await conn.reply(m.chat, msg, m);
        }

        // Kirim file ke pengguna
        await conn.sendMessage(m.chat, { 
            document: { url: res.file }, 
            fileName: res.name, 
            mimetype: res.mime_type 
        }, { quoted: m });

    } catch (e) { 
        throw `🚨 *Error:* ${e}`;
    }
};

handler.help = ['pixeldrain'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(pixeldrain|pd)$/i;
handler.limit = true;
handler.register = false;
handler.premium = false;

module.exports = handler;