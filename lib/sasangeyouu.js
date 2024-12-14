const axios = require('axios');
const cheerio = require('cheerio');

const sasangeyou = {
  Search: async function (query) {
    const searchUrl = `https://sasangeyou.fun/?s=${query}`;
    try {
      const { data } = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        },
      });
      const $ = cheerio.load(data);
      const searchResults = [];
      $('.bsx').each((_, element) => {
        const title = $(element).find('.tt').text().trim();
        const link = $(element).find('a').attr('href');
        const thumb = $(element).find('img').attr('src');
        searchResults.push({ title, link, thumb });
      });
      return searchResults;
    } catch (error) {
      console.error('Error:', error.message);
      return [];
    }
  },

  Latest: async function () {
    const url = 'https://sasangeyou.fun/manga/?order=update';
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        },
      });
      const $ = cheerio.load(data);
      const mangaList = [];
      $('.bsx').each((_, element) => {
        const title = $(element).find('.tt').text().trim();
        const link = $(element).find('a').attr('href');
        const thumb = $(element).find('img').attr('src');
        mangaList.push({ title, link, thumb });
      });
      return mangaList;
    } catch (error) {
      console.error('Error:', error.message);
      return [];
    }
  },
};

module.exports = sasangeyou;
