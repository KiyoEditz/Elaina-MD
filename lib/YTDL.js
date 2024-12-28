const axios = require('axios');
const cheerio = require('cheerio');

async function getYoutubeDownloadLink(url, format = 'mp3') {
    try {
        // Langkah 1: Inisiasi permintaan ke `yt1s.com`
        const initialRes = await axios.get(`https://yt1s.com/en90`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(initialRes.data);
        const token = $('#token').val();

        // Langkah 2: Mendapatkan detail video
        const videoId = url.split('v=')[1];
        const videoInfoRes = await axios.post(`https://yt1s.com/api/ajaxSearch/index`, {
            q: `https://www.youtube.com/watch?v=${videoId}`,
            vt: format === 'mp3' ? 'audio' : 'video',
            token
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            }
        });

        const videoData = videoInfoRes.data;
        if (!videoData.links || !videoData.links[format]) {
            throw new Error("Gagal mendapatkan link download");
        }

        // Mendapatkan link download
        const downloadLink = videoData.links[format]['128'].dlink;

        return {
            title: videoData.title,
            downloadLink,
            thumbnail: videoData.thumb,
            format
        };
    } catch (error) {
        console.error('Error mendapatkan link download:', error.message);
        throw error;
    }
}

module.exports = getYoutubeDownloadLink;