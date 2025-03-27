const axios = require('axios');

async function xdk(url) {
    try {
        const res = await axios.post(
            'https://contentstudio.io/.netlify/functions/facebookdownloaderapi',
            { url },
            {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
                    'Referer': 'https://contentstudio.io/tools/x-twitter-video-downloader',
                }
            }
        );

        return res.data;
    } catch (error) {
        return { error: 'Gagal' };
    }
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Masukkan URL X (Twitter)\n\n*Example :* ${usedPrefix}${command} https://x.com/elonmusk/status/1901663707190419744`);

    const regex = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/\d+/;
    if (!regex.test(args[0])) {
        return m.reply('Berikan URL dari X yang ingin di-download.');
    }

    m.reply('*Please Wait...*');

    try {
        const result = await xdk(args[0]);
m.reply(JSON.stringify(result, null, 2));
        if (result.error) {
            return m.reply('Gagal mengunduh media. Pastikan URL valid dan dapat diakses.');
        }

        let mediaSent = false;

        if (result.medias && result.medias.length > 0) {
            for (const media of result.medias) {
                if (media.url) {
                    const isImage = media.type === 'photo' || /\.(jpg|jpeg|png|webp)$/i.test(media.url);

                    if (isImage && !mediaSent) {
                        await conn.sendMessage(m.chat, { image: { url: media.url } }, { quoted: m });
                        mediaSent = true;
                        break;
                    } else if (!isImage) {
                        await conn.sendMessage(m.chat, { video: { url: media.url } }, { quoted: m });
                        mediaSent = true;
                        break;
                    }
                }
            }
        } else if (result.url) {
            const isImage = result.type === 'photo' || /\.(jpg|jpeg|png|webp)$/i.test(result.url);

            if (isImage) {
                await conn.sendMessage(m.chat, { image: { url: result.url } }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { video: { url: result.url } }, { quoted: m });
            }
        } else {
            m.reply('Format media tidak didukung atau tidak ditemukan.');
        }
    } catch (error) {
        console.error(error);
        m.reply('Gagal Download');
    }
};

handler.help = ['twitter'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.alias = ['x', 'twitter'];
handler.command = /^(x|twitter)$/i;

module.exports = handler;