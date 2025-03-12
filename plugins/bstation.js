/*
Jangan Hapus Wm Bang 

*Bilibili/Bstation Search  Plugins CJS*

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*
https://whatsapp.com/channel/0029VadfVP5ElagswfEltW0L/2192
*/

const axios = require('axios');
const cheerio = require('cheerio');

async function getBsTation(q) {
    try {
        const anu = `https://www.bilibili.tv/id/search-result?q=${q}`;
        const { data } = await axios.get(anu);
        const $ = cheerio.load(data);

        let result = [];

        $('.card-container').each((_, el) => {
            const search = $(el).find('p.card-container__title').text().trim();
            const videoUrl = "https://www.bilibili.tv" + $(el).find('a').attr('href');
            const imageUrl = $(el).find('img').attr('src');
            const views = $(el).find('span.meta__tips-text').text().trim();
            const description = $(el).find('p').text().trim();

            result.push({
                search,
                videoUrl,
                imageUrl,
                views,
                description
            });
        });
        return result;
    } catch (e) {
        console.log(e);
        return [];
    }
}

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('Berikan Query Nya\n\n *Example :* .bilibili Spy X Family');
    
    try {
        const result = await getBsTation(text);
        
        if (result.length === 0) {
            return m.reply('Gak Nemu  Coba Cari Yang Lain');
        }
        
        let teks = 'Bilibili Search\n\n';
        
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            teks += `*Title :* ${item.search}\n\n`;
            teks += `*Views :* ${item.views}\n\n`;
            teks += `*Description :* ${item.description}\n\n`;
            teks += `*Link :* ${item.videoUrl}\n\n`;
        }
        
        await conn.sendMessage(m.chat, { 
            image: { url: result[0].imageUrl }, 
            caption: teks 
        }, { quoted: m });
        
    } catch (e) {
        console.log(e);
        m.reply('Error');
    }
};

handler.help = ['bilibili <query>'];
handler.tags = ['internet'];
handler.command = ['bilibili', 'bstation'];

module.exports = handler;