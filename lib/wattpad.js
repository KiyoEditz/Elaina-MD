/*
*[Scrape Wattpad]* 
(search, list chapter, read chapter)
By Fruatre
wa.me/6285817597752
Saluran: https://whatsapp.com/channel/0029VaNR2B6BadmioY6mar3N
*/

const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function searchWattpad(q) {
    const baseUrl = 'https://www.wattpad.com';
    const url = `${baseUrl}/search/${q}`;
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const results = $('section#section-results-stories article#results-stories ul.list-group li.list-group-item')
        .map((index, element) => ({
            link: baseUrl + $(element).find('.story-card').attr('href'),
            image: $(element).find('.cover img').attr('src'),
            title: $(element).find('.story-info .title[aria-hidden="true"]').first().text().trim(),
            readCount: $(element).find('.new-story-stats .stats-value').eq(0).text(),
            voteCount: $(element).find('.new-story-stats .stats-value').eq(1).text(),
            chapterCount: $(element).find('.new-story-stats .stats-value').eq(2).text(),
            description: $(element).find('.description').text().trim(),
        }))
        .get();
    return results;
}

async function readWattpad(url, page = 1, output = '', prevTitle = null) {
    const pageURL = `${url}/page/${page}`;
    const response = await fetch(pageURL);
    const text = await response.text();
    const $ = cheerio.load(text);
    const newTitle = $('title').text().trim();
    if (newTitle === prevTitle) {
        return output || 'No content available.';
    }
    $('p').each((_, element) => {
        const paragraph = $(element).text().trim();
        if (paragraph) output += `${paragraph}\n\n`;
    });
    const nextURL = $('a.on-navigate.next-up').attr('href');
    if (!nextURL) return output;
    return readWattpad('https://www.wattpad.com' + nextURL, 1, output, newTitle);
}

async function getStartReadingLink(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        const startReadingLink = $('a.read-btn').attr('href');
        return 'https://www.wattpad.com' + startReadingLink;
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

async function listRead(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        const synopsis = $('pre').text().trim() || 'Sinopsis tidak tersedia';
        const chapters = [];
        $('ul[aria-label="story-parts"] li a').each((_, el) => {
            const chapterTitle = $(el).find('.if-sT').text().trim();
            const chapterDate = $(el).find('._8Rbz8').text().trim();
            const chapterLink = $(el).attr('href');
            chapters.push({
                title: chapterTitle,
                date: chapterDate,
                link: chapterLink.startsWith('http') ? chapterLink : `https://www.wattpad.com${chapterLink}`,
            });
        });
        return { synopsis, chapters };
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to fetch table of contents.');
    }
}

module.exports = {
    searchWattpad,
    readWattpad,
    getStartReadingLink,
    listRead,
};