
const axios = require('axios');
const cheerio = require('cheerio');

//BabyBotz Handler
let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('Masukkan username TikTok yang ingin Anda stalk.\n*Contoh:*\n > .ttstalk username');

    try {
        const result = await tiktokStalk(text);
        const { userInfo } = result;

        let message = `\[ User Metadata ]\\n\n`;
        message += Object.entries(userInfo)
            .map(([key, value]) => `> *- ${key.charAt(0).toUpperCase() + key.slice(1)}:* ${value}`)
            .join("\n");

        await m.reply(message);
    } catch (error) {
        throw `Gagal mengambil data: ${error.message}`;
    }
};

handler.help = ['tiktokstalk <username>']
handler.tags = ['search']

handler.command = /^(tiktokstalk)$/i


module.exports = handler;

//fungsi ini!!!! 
async function tiktokStalk(username) {
    try {
        const response = await axios.get(`https://www.tiktok.com/@${username}?_t=ZS-8tHANz7ieoS&_r=1`);
        const html = response.data;
        const $ = cheerio.load(html);
        const scriptData = $('#_UNIVERSAL_DATA_FOR_REHYDRATION_').html();
        const parsedData = JSON.parse(scriptData);

        const userDetail = parsedData._DEFAULT_SCOPE_?.['webapp.user-detail'];
        if (!userDetail) {
            throw new Error('User tidak ditemukan');
        }

        const userInfo = userDetail.userInfo?.user;
        const stats = userDetail.userInfo?.stats;

        const metadata = {
            userInfo: {
                id: userInfo?.id || null,
                username: userInfo?.uniqueId || null,
                nama: userInfo?.nickname || null,
                avatar: userInfo?.avatarLarger || null,
                bio: userInfo?.signature || null,
                verifikasi: userInfo?.verified || false,
                totalfollowers: stats?.followerCount || 0,
                totalmengikuti: stats?.followingCount || 0,
                totaldisukai: stats?.heart || 0,
                totalvideo: stats?.videoCount || 0,
                totalteman: stats?.friendCount || 0,
            }
        };

        return metadata;
    } catch (error) {
        throw new Error(error.message);
    }
}