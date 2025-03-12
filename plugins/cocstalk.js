/* Plugin Stalker Clash of Clans type cjs
   Scraper by fruatre
*/
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeCOC(playerTag) {
    try {
        const url = `https://brawlace.com/coc/players/%23${playerTag}`;
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);

        const getText = (selector, regex) => 
            $(selector).filter((_, el) => $(el).text().includes(regex.split(" ")[0]))
                .text().match(new RegExp(regex))?.[1] || "Tidak ditemukan";

        return {
            name: $('h2.pt-3').text().trim() || "Tidak ditemukan",
            clan: $('h3.pb-2 a').text().trim() || "Tidak ada clan",
            level: getText('div.card-body', "Level (\\d+)"),
            trophies: getText('div.card-body', "Trophies (\\d+)"),
            bestTrophy: $('div.card-body').filter((_, el) => $(el).text().includes("Best Season")).text().match(/Trophies (\d+)/)?.[1] || "Tidak ditemukan",
            townHall: getText('div.card-body', "Town Hall Level (\\d+)"),
            warStars: getText('div.card-body', "War Stars (\\d+)"),
            attackWins: getText('div.card-body', "Attack Wins (\\d+)"),
            defenseWins: getText('div.card-body', "Defense Wins (\\d+)"),
            legendRank: getText('div.card-body', "Current Season.*?Rank (\\d+)"),
            profileUrl: url
        };
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `*Contoh:* ${usedPrefix}${command} 8000QP00C`;

    try {
        const playerTag = args[0].toUpperCase().replace(/#/g, '');
        const data = await scrapeCOC(playerTag);

        if (!data) throw '*Data tidak ditemukan atau terjadi kesalahan!*';

        let message = `*Clash of Clans Player Stalker*\n\n`;
        message += `Nama > ${data.name}\n`;
        message += `Clan > ${data.clan}\n`;
        message += `Level > ${data.level}\n`;
        message += `Trophies > ${data.trophies}\n`;
        message += `Best Trophy > ${data.bestTrophy}\n`;
        message += `Town Hall Level > ${data.townHall}\n`;
        message += `War Stars > ${data.warStars}\n`;
        message += `Attack Wins > ${data.attackWins}\n`;
        message += `Defense Wins > ${data.defenseWins}\n`;
        message += `Legend Rank > ${data.legendRank}\n\n`;
        message += `Profile URL > ${data.profileUrl}`;

        await conn.reply(m.chat, message, m);
    } catch (e) {
        console.error(e);
        throw '*Terjadi kesalahan saat mengambil data!*';
    }
};

handler.help = ['cocstalk'].map(v => v + ' <playerTag>');
handler.tags = ['stalk'];
handler.command = /^(cocstalk|stalkcoc)$/i;
handler.limit = true;

module.exports = handler;