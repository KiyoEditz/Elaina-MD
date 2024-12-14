/* 
By Fruatre
Saluran : https://whatsapp.com/channel/0029VaNR2B6BadmioY6mar3N
*/

const axios = require('axios');
const cheerio = require('cheerio');

const Latest = async () => {
  const url = 'https://anichin.date/';
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const results = [];

    $('.listupd.normal .bs').each((_, element) => {
      const linkElement = $(element).find('a');
      const title = linkElement.attr('title');
      const url = linkElement.attr('href');
      const episode = $(element).find('.bt .epx').text().trim();
      const thumbnail = $(element).find('img').attr('src');
      const type = $(element).find('.typez').text().trim();

      results.push({ title, url, episode, thumbnail, type });
    });

    return results;
  } catch (error) {
    throw new Error(`Error fetching latest: ${error}`);
  }
};

const Episode = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const episodes = [];

    $('.eplister ul li').each((_, element) => {
      const episodeNumber = $(element).find('.epl-num').text().trim();
      const title = $(element).find('.epl-title').text().trim();
      const subStatus = $(element).find('.epl-sub .status').text().trim();
      const releaseDate = $(element).find('.epl-date').text().trim();
      const link = $(element).find('a').attr('href');

      episodes.push({ episodeNumber, title, subStatus, releaseDate, link });
    });

    return episodes;
  } catch (error) {
    throw new Error(`Error fetching episodes: ${error}`);
  }
};

const Download = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const downloads = [];

    $('.mctnx .soraddlx').each((_, element) => {
      const resolution = $(element).find('.soraurlx strong').first().text().trim();
      const links = [];

      $(element).find('.soraurlx a').each((_, linkElement) => {
        const host = $(linkElement).text().trim();
        const url = $(linkElement).attr('href');
        links.push({ host, url });
      });

      downloads.push({ resolution, links });
    });

    return downloads;
  } catch (error) {
    throw new Error(`Error fetching downloads: ${error.message}`);
  }
};

const Detail = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('.entry-title').text().trim();
    const thumbnail = $('.thumb img').attr('src');
    const rating = $('.rating strong').text().replace('Rating ', '').trim();
    const followers = $('.bmc').text().replace('Followed ', '').replace(' people', '').trim();
    const synopsis = $('.synp .entry-content').text().trim();
    const alternativeTitles = $('.alter').text().trim();
    const status = $('.info-content .spe span:contains("Status")').text().replace('Status:', '').trim();
    const studio = $('.info-content .spe span:contains("Studio") a').text().trim();
    const released = $('.info-content .spe span:contains("Released")').text().replace('Released:', '').trim();
    const duration = $('.info-content .spe span:contains("Duration")').text().replace('Duration:', '').trim();
    const genres = $('.genxed a').map((_, el) => $(el).text().trim()).get();

    return { title, thumbnail, rating, followers, synopsis, alternativeTitles, status, studio, released, duration, genres };
  } catch (error) {
    throw new Error(`Error scraping detail: ${error.message}`);
  }
};

const Search = async (query) => {
  const url = `https://anichin.date/?s=${encodeURIComponent(query)}`;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const results = [];

    $('.listupd article').each((_, el) => {
      const title = $(el).find('.tt h2').text().trim();
      const type = $(el).find('.typez').text().trim();
      const status = $(el).find('.bt .epx').text().trim();
      const link = $(el).find('a').attr('href');
      const image = $(el).find('img').attr('src');

      results.push({ title, type, status, link, image });
    });

    return results;
  } catch (error) {
    throw new Error(`Error fetching search results: ${error.message}`);
  }
};

const Popular = async () => {
  const url = 'https://anichin.date/';
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const popularToday = [];

    $('.bixbox .listupd .bsx').each((_, element) => {
      const title = $(element).find('.tt').text().trim();
      const episode = $(element).find('.bt .epx').text().trim();
      const type = $(element).find('.typez').text().trim();
      const link = $(element).find('a').attr('href');
      const image = $(element).find('img').attr('src');

      popularToday.push({ title, episode, type, link, image });
    });

    return popularToday;
  } catch (error) {
    throw new Error(`Error fetching popular: ${error.message}`);
  }
};

const handler = async (m, { text }) => {
  const [action, query] = text.split('--');
  if (!action) {
    return m.reply(`Gunakan format:\n\n- .anichin latest\n- .anichin search--query\n- .anichin detail--url\n- .anichin episode--url\n- .anichin download--url\n- .anichin popular`);
  }

  try {
    let response;
    switch (action.trim().toLowerCase()) {
      case 'latest':
        const latestResults = await Latest();
        response = latestResults.map(({ title, url, episode, thumbnail, type }) =>
          `*${title}*\nEpisode: ${episode}\nType: ${type}\nURL: ${url}\nThumbnail: ${thumbnail}\n`
        ).join('\n');
        break;

      case 'search':
        if (!query) return m.reply('Masukkan kata kunci untuk pencarian.');
        const searchResults = await Search(query.trim());
        response = searchResults.map(({ title, type, status, link, image }) =>
          `*${title}*\nType: ${type}\nStatus: ${status}\nURL: ${link}\nThumbnail: ${image}\n`
        ).join('\n');
        break;

      case 'detail':
        if (!query) return m.reply('Masukkan URL untuk detail.');
        const detailResult = await Detail(query.trim());
        response = `*${detailResult.title}*\nRating: ${detailResult.rating}\nFollowers: ${detailResult.followers}\nStatus: ${detailResult.status}\nStudio: ${detailResult.studio}\nReleased: ${detailResult.released}\nDuration: ${detailResult.duration}\nGenres: ${detailResult.genres.join(', ')}\nSynopsis: ${detailResult.synopsis}\nThumbnail: ${detailResult.thumbnail}`;
        break;

      case 'episode':
        if (!query) return m.reply('Masukkan URL untuk episode.');
        const episodeResults = await Episode(query.trim());
        response = episodeResults.map(({ episodeNumber, title, subStatus, releaseDate, link }) =>
          `*${title}*\nEpisode: ${episodeNumber}\nSub Status: ${subStatus}\nRelease Date: ${releaseDate}\nURL: ${link}\n`
        ).join('\n');
        break;

      case 'download':
        if (!query) return m.reply('Masukkan URL untuk download.');
        const downloadResults = await Download(query.trim());
        response = downloadResults.map(({ resolution, links }) =>
          `*Resolution: ${resolution}*\n${links.map(({ host, url }) => `- ${host}: ${url}`).join('\n')}\n`
        ).join('\n');
        break;

      case 'popular':
        const popularResults = await Popular();
        response = popularResults.map(({ title, episode, type, link, image }) =>
          `*${title}*\nEpisode: ${episode}\nType: ${type}\nURL: ${link}\nThumbnail: ${image}\n`
        ).join('\n');
        break;

      default:
        response = 'Perintah tidak dikenali. Gunakan salah satu dari: latest, search, detail, episode, download, popular.';
    }

    m.reply(response);
  } catch (error) {
    m.reply(`Terjadi kesalahan: ${error}`);
  }
};

handler.help = ['anichin'];
handler.command = ['anichin'];
handler.tags = ['anime'];

module.exports = handler;
