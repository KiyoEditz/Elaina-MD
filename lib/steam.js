
const axios = require('axios');
const cheerio = require('cheerio');

async function steam(query) {
try {
const searchUrl = `https://store.steampowered.com/search/?term=${encodeURIComponent(query)}`;
const { data } = await axios.get(searchUrl, {
headers: { 'User-Agent': 'Mozilla/5.0' }
});

const $ = cheerio.load(data);
const firstGameLink = $('.search_result_row').first().attr('href');
const appId = firstGameLink?.split('/')[4];

if (!appId) return null;

const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
const gameData = response.data[appId].data;

const screenshots = await extractScreenshots(appId, gameData);
const trailers = await extractTrailers(appId, gameData);

return {
id: appId,
name: gameData.name,
description: gameData.detailed_description.replace(/<[^>]*>/g, '').trim(),
image: gameData.header_image,
screenshots,
trailers,
price: gameData.price_overview?.final_formatted || 'Gratis',
developers: gameData.developers,
genres: gameData.genres.map(genre => genre.description),
release: gameData.release_date.date,
url: firstGameLink
};

} catch {
return null;
}
}

async function extractScreenshots(appId, gameData) {
if (gameData.screenshots?.length) {
return gameData.screenshots.map(ss => ss.path_full);
}

try {
const { data } = await axios.get(`https://store.steampowered.com/app/${appId}`, {
headers: { 'User-Agent': 'Mozilla/5.0' }
});

const $ = cheerio.load(data);
return $('.screenshot_holder a.screenshot_expand_full')
.map((i, elem) => $(elem).attr('href'))
.get()
.filter(Boolean);
} catch {
return [];
}
}

async function extractTrailers(appId, gameData) {
const trailers = [];

if (gameData.movies?.length) {
trailers.push(...gameData.movies.map(movie => ({
webm: movie.webm?.max,
mp4: movie.mp4?.max,
name: movie.name || 'Trailer'
})));
}

try {
const { data } = await axios.get(`https://store.steampowered.com/app/${appId}`, {
headers: { 'User-Agent': 'Mozilla/5.0' }
});

const $ = cheerio.load(data);

$('.highlight_movie video source, .game_header_video_section video source')
.each((i, elem) => {
const url = $(elem).attr('src');
if (url && !trailers.some(t => t.webm === url || t.mp4 === url)) {
trailers.push({ 
webm: url, 
name: `Additional Trailer ${trailers.length + 1}` 
});
}
});
} catch {}

return trailers;
}

module.exports = { steam }