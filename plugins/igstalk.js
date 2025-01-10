/*
*[Plugins Igstalk]* 
By Fruatre
wa.me/6285817597752
Saluran : https://whatsapp.com/channel/0029VaNR2B6BadmioY6mar3N
*/

const cheerio = require('cheerio');
const axios = require('axios');

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply("Masukkan nama pengguna Instagram yang valid!");
    try {
        const data = await stalkige(args[0]);
        const caption = `
Nama Pengguna: ${data.namalu}
Bio: ${data.bio}
Jumlah Postingan: ${data.totalpost}
Jumlah Pengikut: ${data.totalpengikut}
        `;
        await conn.sendFile(m.chat, data.linkpp, 'profile.jpg', caption, m);
    } catch (e) {
        m.reply(e.message || "Terjadi kesalahan.");
    }
};

handler.help = handler.command = ['igstalk'];
handler.tags = ['downloader'];
module.exports = handler;

async function stalkige(namalu) {
    const url = `https://greatfon.io/v/${encodeURIComponent(namalu)}`;
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://greatfon.io',
            },
        });

        const $ = cheerio.load(data);

        const namalu = $('h1.text-4xl').text().trim() || 'Tidak ditemukan';
        const bio = $('.items-top .text-sm').text().trim() || 'Tidak ada bio';
        const totalpost = $('.stat-title:contains("Posts")').siblings('.stat-value').text().trim() || '0';
        const totalpengikut = $('.stat-title:contains("Followers")').siblings('.stat-value').text().trim() || '0';
        const linkpp = $('figure img').attr('src') || 'https://via.placeholder.com/150'; // Gambar default jika tidak ditemukan

        return {
            namalu,
            bio,
            totalpost,
            totalpengikut,
            linkpp,
        };
    } catch (error) {
        throw new Error("Terjadi kesalahan saat mengambil data. Pastikan nama pengguna benar.");
    }
}