/*
By Fruatre
wa.me/6285817597752
Saluran : https://whatsapp.com/channel/0029VaNR2B6BadmioY6mar3N
*/

const axios = require('axios');
const cheerio = require('cheerio');

const handler = async (m, { text, args }) => {
  if (!text) return m.reply('Gunakan format:\n.harimanga search#query\n.harimanga latest\n.harimanga detail#url\n.harimanga chapters#url');

  const [command, param] = text.split('#');
  if (!command) return m.reply('Perintah tidak valid.');

  const harimanga = new Harimanga();

  try {
    switch (command.trim()) {
      case 'search':
        if (!param) return m.reply('Masukkan query untuk mencari.\nContoh: .harimanga search#romance');
        const searchResults = await harimanga.search(param);
        return m.reply(
          searchResults.length > 0
            ? searchResults
                .map(
                  (r, i) =>
                    `${i + 1}. ${r.title}\nGenres: ${r.genres.join(', ')}\nStatus: ${r.status}\nRating: ${r.rating}\nLatest Chapter: ${r.latestChapter}\nLink: ${r.link}`
                )
                .join('\n\n')
            : 'Tidak ada hasil ditemukan.'
        );

      case 'latest':
        const latestResults = await harimanga.latest();
        return m.reply(
          latestResults
            .map(
              (r, i) =>
                `${i + 1}. ${r.title}\nLatest Chapter: ${r.latestChapter}\nLink: ${r.link}\nChapter Link: ${r.chapterLink}`
            )
            .join('\n\n')
        );

      case 'detail':
        if (!param) return m.reply('Masukkan URL detail.\nContoh: .harimanga detail#https://...');
        const detail = await harimanga.detail(param);
        return m.reply(
          `Judul: ${detail.title}\nRating: ${detail.rating}\nRank: ${detail.rank}\nStatus: ${detail.status}\nGenres: ${detail.genres.join(', ')}\nImage: ${detail.image}`
        );

      case 'chapters':
        if (!param) return m.reply('Masukkan URL chapters.\nContoh: .harimanga chapters#https://...');
        const chapters = await harimanga.chapters(param);
        return m.reply(chapters);

      default:
        return m.reply('Perintah tidak dikenal.');
    }
  } catch (e) {
    return m.reply(`Terjadi kesalahan: ${e.message}`);
  }
};

handler.help = ['harimanga'];
handler.command = ['harimanga'];
handler.tags = ['anime'];
module.exports = handler;

// Class Harimanga
class Harimanga {
  async latest() {
    const { data } = await axios.get('https://harimanga.me/');
    const $ = cheerio.load(data);

    const results = [];
    let count = 0;

    $('.page-listing-item').each((i, el) => {
      if (count >= 10) return false;

      const title = $(el).find('.post-title h3 a').text().trim();
      const link = $(el).find('.post-title h3 a').attr('href');
      const latestChapter = $(el).find('.list-chapter .chapter-item .chapter a').first().text().trim();
      const chapterLink = $(el).find('.list-chapter .chapter-item .chapter a').first().attr('href');

      results.push({ title, link, latestChapter, chapterLink });
      count++;
    });

    return results;
  }

  async search(query) {
    const url = `https://harimanga.me/?s=${encodeURIComponent(query)}&post_type=wp-manga`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const results = [];

    $('.c-tabs-item__content').each((_, el) => {
      const title = $(el).find('.post-title a').text().trim();
      const link = $(el).find('.post-title a').attr('href');
      const img = $(el).find('.tab-thumb img').attr('src');
      const genres = $(el).find('.mg_genres .summary-content a').map((_, g) => $(g).text().trim()).get();
      const status = $(el).find('.mg_status .summary-content').text().trim();
      const latestChapter = $(el).find('.latest-chap .chapter a').text().trim();
      const chapterLink = $(el).find('.latest-chap .chapter a').attr('href');
      const rating = $(el).find('.rating .score').text().trim();

      results.push({ title, link, img, genres, status, latestChapter, chapterLink, rating });
    });

    return results;
  }

  async detail(url) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('.post-title h1').text().trim();
    const image = $('.summary_image img').attr('src');
    const rating = $('.post-total-rating .score').first().text().trim();
    const rank = $('.post-content_item:contains("Rank") .summary-content').text().trim();
    const status = $('.post-content_item:contains("Status") .summary-content').text().trim();
    const genres = $('.post-content_item:contains("Genre(s)") .genres-content a')
      .map((_, el) => $(el).text().trim())
      .get();

    return { title, image, rating, rank, status, genres };
  }

  async chapters(url) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('.post-title h1').text().trim();
    const chapters = $('.wp-manga-chapter').map((_, el) => {
      const chapterTitle = $(el).find('a').first().text().trim();
      const link = $(el).find('a').first().attr('href');
      const releaseDate = $(el).find('.chapter-release-date i').text().trim() || 'Unknown';

      return `title: ${chapterTitle},\nlink: ${link},\ntanggal rilis: ${releaseDate}`;
    }).get();

    return `${title}\n\n${chapters.join('\n')}`;
  }
}
