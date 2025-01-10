const teradlx = require('../lib/terabox');

let handler = async (m, { conn, command, text, args }) => {
    if (!text) {
        throw `_*Link nya mana?!*_\n\nContoh:\n${usedPrefix}${command} https://www.terabox.app/wap/share/filelist?surl=qx26_6N3phpSAfwtefjT-g`;
    }

    try {
        conn.reply(m.chat, `_Sedang memproses, harap tunggu..._`, m);

        // Mengambil respons dari scraper
        const response = await teradlx(text);
        const { filename, size, download } = response;

        // Membuat caption untuk file
        let capt = `╭──── 〔 TERABOX 〕 ─⬣\n`;
        capt += ` ⬡ *Title* : ${filename}\n`;
        capt += ` ⬡ *Size* : ${size}\n`;
        capt += `╰────────⬣\n`;

        // Mengirim dokumen dengan nama file dan tipe MIME yang sesuai
        conn.sendMessage(
            m.chat,
            {
                document: download,
                mimetype: getMimeType(filename),
                fileName: filename,
                caption: capt,
            },
            { quoted: m }
        );
    } catch (e) {
        throw `Error: ${e.message || e}`;
    }
};

// Fungsi untuk mendapatkan MIME type berdasarkan ekstensi file
function getMimeType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
        zip: 'application/zip',
        rar: 'application/x-rar-compressed',
        pdf: 'application/pdf',
        mp4: 'video/mp4',
        mkv: 'video/x-matroska',
        mp3: 'audio/mpeg',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        txt: 'text/plain',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        default: 'application/octet-stream', // MIME type default
    };

    return mimeTypes[extension] || mimeTypes.default;
}

handler.help = ['teraboxdl'];
handler.command = /^(teraboxdl|teradl|terabox)$/i;
handler.tags = ['downloader', 'tools'];
handler.premium = false;

module.exports = handler;