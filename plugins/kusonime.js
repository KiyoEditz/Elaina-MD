const axios = require('axios');
const cheerio = require('cheerio');

const kusonime = {
    search: async function(query) {
        try {
            const { data } = await axios.get(`https://kusonime.com/?s=${encodeURIComponent(query)}&post_type=post`);
            const $ = cheerio.load(data);

            const result = $('.kover').map((_, element) => {
                const $element = $(element);
                return {
                    title: $element.find('.episodeye a').text().trim(),
                    link: $element.find('.episodeye a').attr('href'),
                    thumbnail: $element.find('.thumbz img').attr('src'),
                    postedBy: $element.find('.fa-user').parent().text().replace('Posted by', '').trim(),
                    releaseTime: $element.find('.fa-clock-o').parent().text().replace('Released on', '').trim(),
                    genres: $element.find('.fa-tag').parent().find('a').map((_, genre) => $(genre).text().trim()).get()
                };
            }).get();
            return { data: result };
        } catch (error) {
            return { data: [] };
        }
    },

    detail: async function(url) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const info = {};
            $('.info p').each((_, element) => {
                const text = $(element).text().trim();
                if (text.includes(':')) {
                    const [key, value] = text.split(':').map(item => item.trim());
                    info[key] = value;
                }
            });
            const synopsis = $('.lexot p').map((_, element) => {
                const text = $(element).text().trim();
                return (!text.includes('Released on') && !text.includes('Credit') && text.length > 0 && !text.includes(':')) ? text : null;
            }).get().filter(Boolean);
            const dlink = {};
            $('.smokeurlrh').each((_, element) => {
                const $element = $(element);
                const quality = $element.find('strong').text().trim();
                const links = {};
                $element.find('a').each((_, link) => {
                    const $link = $(link);
                    links[$link.text().trim()] = $link.attr('href');
                });
                dlink[quality] = links;
            });
            return {
                data: {
                    title: $('.jdlz').text().trim(),
                    thumbnail: $('.post-thumb img').attr('src'),
                    views: $('.viewoy').text().trim(),
                    info,
                    synopsis,
                    dlink
                }
            };
        } catch (error) {
            return { data: null };
        }
    }
};

const handler = async (m, { args, command }) => {
    if (command === 'kusonime') {
        const query = args.join(' ');
        if (!query) return m.reply('Silakan masukkan judul anime yang ingin dicari.');

        const result = await kusonime.search(query);
        if (result.data.length === 0) {
            return m.reply('Tidak ditemukan hasil untuk pencarian tersebut.');
        }

        let message = '📚 Hasil pencarian:\n\n';
        result.data.forEach((anime, idx) => {
            message += `${idx + 1}. ${anime.title}\nLink: ${anime.link}\nGenres: ${anime.genres.join(', ')}\n\n`;
        });

        m.reply(message.trim());
    }

    if (command === 'kusonime-detail') {
        const url = args[0];
        if (!url) return m.reply('Harap masukkan URL detail anime yang ingin dicari.');

        const result = await kusonime.detail(url);
        if (!result.data) {
            return m.reply('Gagal mengambil data dari URL tersebut.');
        }

        const { title, thumbnail, views, info, synopsis, dlink } = result.data;
        let message = `🎬 *${title}*\n📸 ${thumbnail}\n👁️‍🗨️ Views: ${views}\n\n`;
        message += `ℹ️ Informasi:\n`;
        for (const [key, value] of Object.entries(info)) {
            message += `- ${key}: ${value}\n`;
        }

        message += `\n📜 Sinopsis:\n${synopsis.join('\n')}\n\n`;
        message += `🎥 Download link: \n`;
        for (const [quality, links] of Object.entries(dlink)) {
            message += `\n${quality}:\n`;
            for (const [label, link] of Object.entries(links)) {
                message += `- ${label}: ${link}\n`;
            }
        }

        //m.reply(message.trim());
        conn.sendMessage(m.chat, { 
        image: { url: thumbnail }, 
        caption: message.trim()
    }, { quoted: m });
    }
};

handler.command = ['kusonime', 'kusonime-detail'];
handler.tags = ['anime', 'tools'];
handler.help = ['kusonime query', 'kusonime-detail url'];

module.exports = handler;