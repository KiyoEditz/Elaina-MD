/* [ CAPCUT DOWNLOADER ]
Scrape by https://whatsapp.com/channel/0029Vb2mOzL1Hsq0lIEHoR0N/144
*/

const axios = require('axios');
const cheerio = require('cheerio');

const handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply(`*• Example :* ${usedPrefix + command} *[url capcut]*`);
    m.reply('Tunggu sebentar...');
    
    try {
        const result = await capcutdl(text);

        if (!result) {
            return m.reply('❌ Gagal mendapatkan data. Pastikan URL yang dimasukkan benar.');
        }

        const cpt = `*乂 C A P C U T - D O W N L O A D E R*\n\n   ◦ Title : ${result.title}\n   ◦ Date : ${result.date}\n   ◦ Pengguna : ${result.pengguna}\n   ◦ Likes : ${result.likes}\n   ◦ Author : ${result.author.name}`;
        await conn.sendFile(m.chat, result.videoUrl, '', cpt, m, {
            thumbnail: await (await axios.get(result.posterUrl, { responseType: 'arraybuffer' })).data
        });
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan saat mengambil data.');
    }
};

handler.help = ["capcut"].map((a) => a + " *[url capcut]*");
handler.tags = ["downloader"];
handler.command = ["capcut"];

module.exports = handler;

async function capcutdl(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const videoElement = $('video.player-o3g3Ag');
        const videoSrc = videoElement.attr('src');
        const posterSrc = videoElement.attr('poster');
        const title = $('h1.template-title').text().trim();
        const actionsDetail = $('p.actions-detail').text().trim();
        const [date, uses, likes] = actionsDetail.split(',').map(item => item.trim());
        const authorAvatar = $('span.lv-avatar-image img').attr('src');
        const authorName = $('span.lv-avatar-image img').attr('alt');

        if (!videoSrc || !posterSrc || !title || !date || !uses || !likes || !authorAvatar || !authorName) {
            throw new Error('Beberapa elemen penting tidak ditemukan di halaman.');
        }

        return {            
            title: title,
            date: date,
            pengguna: uses,
            likes: likes,
            author: {
                name: authorName,
                avatarUrl: authorAvatar
            },
            videoUrl: videoSrc,
            posterUrl: posterSrc
        };
    } catch (error) {
        console.error('Error fetching video details:', error.message);
        return null;
    }
}