const axios = require('axios');
const cheerio = require('cheerio');

const lyrics = {
  search: async (song) => {
    try {
        const { data } = await axios.get(`https://www.lyrics.com/lyrics/${song}`);
        const $ = cheerio.load(data);
        const result = $('.best-matches .bm-case').map((i, element) => {
            const title = $(element).find('.bm-label a').first().text();
            const artist = $(element).find('.bm-label a').last().text();
            const album = $(element).find('.bm-label').eq(1).text().trim().replace(/\s+/g, ' ');
            const imageUrl = $(element).find('.album-thumb img').attr('src');
            const link = $(element).find('.bm-label a').first().attr('href');

            return {
                title,
                artist,
                album,
                imageUrl,
                link: `https://www.lyrics.com${link}`
            };
        }).get();

        return result;
    } catch (error) {
        console.error(`Terjadi kesalahan: ${error.message}`);
    }
  },
  getLyrics: async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const artistImage = $('#featured-artist-avatar img').attr('src');
        const about = $('.artist-meta .bio').text().trim();
        const year = $('.lyric-details dt:contains("Year:") + dd').text().trim();
        const playlists = $('.lyric-details dt:contains("Playlists") + dd a').text().trim();
        const lyrics = $('#lyric-body-text').text().trim();

        const result = {
            artistImage,
            about,
            year,
            playlists,
            lyrics
        };

        return result;
    } catch (error) {
        console.error(`Terjadi kesalahan: ${error.message}`);
    }
  }
}

module.exports = { lyrics };