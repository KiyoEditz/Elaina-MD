/*
By Fruatre
wa.me/6285817597752
Saluran : https://whatsapp.com/channel/0029VaNR2B6BadmioY6mar3N
*/

const axios = require('axios');
const cheerio = require('cheerio');

const handler = async (m, { text, command }) => {
  const [type, query] = text.split('#');
  if (!type || !query) {
    return m.reply(`Gunakan format: .anilist ${command}#query`);
  }

  if (type === 'search') {
    const results = await search(query);
    if (!results.length) return m.reply('Tidak ada hasil ditemukan.');
    const response = results
      .map(({ title, imageUrl, link }) => `*${title}*\n${link}\n`)
      .join('\n');
    return m.reply(response);
  }

  if (type === 'detail') {
    const result = await detail(query);
    if (!result) return m.reply('Detail tidak ditemukan.');
    const { title, description, cover, genres } = result;
    return m.reply(`*${title.romaji}*\nDeskripsi: ${description.translated}\nGenres: ${genres.translated.join(', ')}\nCover: ${cover}`);
  }
};

async function search(query) {
  const { data } = await axios.get(`https://anilist.co/search/anime?query=${encodeURIComponent(query)}`);
  const $ = cheerio.load(data);
  return $('.media-card').map((_, el) => ({
    title: $(el).find('.title').text().trim(),
    imageUrl: $(el).find('.image').attr('src'),
    link: `https://anilist.co${$(el).find('.cover').attr('href')}`,
  })).get();
}

async function detail(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const descriptionText = $('.description.content-wrap').text().replace(/\n\s+/g, ' ').trim();
  return {
    title: {
      romaji: $('.content h1').first().text().trim(),
    },
    description: {
      translated: descriptionText,
    },
    cover: $('.cover-wrap-inner .cover').attr('src'),
    genres: {
      translated: $('div.data-set:contains("Genres") .value a').map((_, el) => $(el).text().trim()).get(),
    },
  };
}

handler.help = handler.command = ['anilist'];
handler.tags = ['anime'];

module.exports = handler;
