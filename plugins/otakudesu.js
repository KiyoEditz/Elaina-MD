const axios = require("axios");
const cheerio = require("cheerio");

const searchHeader = 'Hasil pencarian:';
const episodeHeader = 'Daftar episode:';
const downloadHeader = 'Download link:';
const separator = '========================';

const baseUrl = "https://otakudesu.cloud";

async function latestAnime() {
    try {
        const url = `${baseUrl}/ongoing-anime/`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let animeList = [];

        $(".venz ul li").each((i, elem) => {
            const title = $(elem).find("h2.jdlflm").text().trim();
            const episode = $(elem).find(".epz").text().replace("Episode ", "").trim();
            const releaseDay = $(elem).find(".epztipe").text().trim();
            const releaseDate = $(elem).find(".newnime").text().trim();
            const image = $(elem).find(".thumbz img").attr("src");
            const link = $(elem).find(".thumb a").attr("href");

            animeList.push({ title, episode, releaseDay, releaseDate, image, link });
        });

        return animeList;
    } catch (error) {
        console.error("Error in latestAnime:", error);
        return { error: "Gagal mengambil data anime terbaru." };
    }
}

async function animeDetail(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const title = $('title').text().split('|')[0].trim();
        const description = $('meta[name="description"]').attr('content');
        const image = $('meta[property="og:image"]').attr('content');
        const publishedTime = $('meta[property="article:published_time"]').attr('content');
        const modifiedTime = $('meta[property="article:modified_time"]').attr('content');

        const titleJapanese = $('p:contains("Japanese")').text().replace(/^Japanese\s*:\s*/, '').trim();
        const score = $('p:contains("Skor")').text().replace(/^Skor\s*:\s*/, '').trim();
        const rating = $('p:contains("Rating")').text().replace(/^Rating\s*:\s*/, '').trim();
        const producer = $('p:contains("Produser")').text().replace(/^Produser\s*:\s*/, '').trim();
        const type = $('p:contains("Tipe")').text().replace(/^Tipe\s*:\s*/, '').trim();
        const status = $('p:contains("Status")').text().replace(/^Status\s*:\s*/, '').trim();
        const totalEpisodes = $('p:contains("Total Episode")').text().replace(/^Total Episode\s*:\s*/, '').trim();
        const duration = $('p:contains("Durasi")').text().replace(/^Durasi\s*:\s*/, '').trim();
        const releaseDate = $('p:contains("Tanggal Rilis")').text().replace(/^Tanggal Rilis\s*:\s*/, '').trim();
        const studio = $('p:contains("Studio")').text().replace(/^Studio\s*:\s*/, '').trim();
        const genres = $('p:contains("Genre") a').map((i, el) => $(el).text().trim()).get().join(', ');
        const synopsis = $('.sinopc p').map((i, el) => $(el).text().trim()).get().join(' ');

        return { 
            title, titleJapanese, description, image, publishedTime, modifiedTime, 
            score, rating, producer, type, status, totalEpisodes, duration, 
            releaseDate, studio, genres, synopsis, url 
        };
    } catch (error) {
        console.error("Error in animeDetail:", error);
        return { error: "Gagal mengambil data." };
    }
}

async function searchAnime(query) {
    try {
        const searchUrl = `${baseUrl}/?s=${encodeURIComponent(query)}&post_type=anime`;
        const { data } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const results = [];

        $('.chivsrc > li').each((i, el) => {
            const image = $(el).find('img').attr('src');
            const title = $(el).find('h2 a').text().trim();
            const url = $(el).find('h2 a').attr('href');
            const genres = [];
            $(el).find('.set').eq(0).find('a').each((_, genre) => {
                genres.push($(genre).text().trim());
            });
            const status = $(el).find('.set').eq(1).text().replace(/^Status\s*:\s*/, '').trim();
            const rating = $(el).find('.set').eq(2).text().replace(/^Rating\s*:\s*/, '').trim();

            if (title && url) {
                results.push({ title, url, image, genres, status, rating });
            }
        });

        return results;
    } catch (error) {
        console.error("Error in searchAnime:", error);
        return { error: "Gagal mengambil data, coba lagi nanti." };
    }
}

async function episodeData(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const episodes = [];

        $('.episodelist ul li').each((index, element) => {
            const title = $(element).find('a').text().trim();
            const url = $(element).find('a').attr('href');
            const date = $(element).find('.zeebr').text().trim();

            episodes.push({ title, url, date });
        });

        return {
            title: $('.monktit').text().trim(),
            episodes,
        };
    } catch (error) {
        console.error("Error in episodeData:", error);
        return null;
    }
}

async function videoData(url) {
    try {
        const { data } = await axios.get(url);
        const regex = /sources:\s*(.*?)/;
        const matches = data.match(regex);
        if (matches) {
            const jsonObject = JSON.parse(matches[1].replace(/'/g, '"'));
            return jsonObject[0].file;
        } else {
            throw new Error('Data not found');
        }
    } catch (error) {
        console.error("Error in videoData:", error);
        throw error;
    }
}

async function linkDownloadData(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const iframeSrc = $('#lightsVideo iframe').attr('src');
        const episodes = $('.download li').map((index, element) => {
            const title = $(element).find('strong').text();
            const links = $(element).find('a').map((index, linkElement) => ({
                text: $(linkElement).text().trim(),
                url: $(linkElement).attr('href'),
            })).get();
            const size = $(element).find('i').text().trim();

            return { title, links, size };
        }).get();

        return {
            title: $('h4').text().trim(),
            frame: iframeSrc,
            episodes,
        };
    } catch (error) {
        console.error("Error in linkDownloadData:", error);
        return null;
    }
}

const handler = async (m, { conn, command, args }) => {
    if (command === "otakudesu") {
        if (!args.length) {
            return m.reply("Gunakan format :\n- *otakudesu latest* : Anime terbaru\n- *otakudesu search <judul>* : Cari anime\n- *otakudesu detail <url>* : Detail \n- *otakudesu episode <url>* : episode anime\n- *otakudesu download <url>* : download episode anime\n- *otakudesu video <url>* : stream anime");
        } else if (args[0] === "latest") {
            let data = await latestAnime();
            if (data.error) return m.reply(data.error);

            let message = "Anime Terbaru : \n\n";
            data.slice(0, 10).forEach((anime, i) => {
                message += `${i + 1}. ${anime.title}\nEpisode : ${anime.episode}\nRilis : ${anime.releaseDate}\nLink : ${anime.link}\n\n`;
            });

            return m.reply(message);
        } else if (args[0] === "search") {
            if (!args[1]) return m.reply("Masukkan judul anime yang ingin dicari.");
            let data = await searchAnime(args.slice(1).join(" "));
            if (data.error) return m.reply(data.error);

            let message = "Hasil Pencarian : \n\n";
            data.slice(0, 10).forEach((anime, i) => {
                message += `${i + 1}. ${anime.title}\nStatus : ${anime.status}\nRating : ${anime.rating}\nLink : ${anime.url}\n\n`;
            });

            return m.reply(message);
        } else if (args[0] === "detail") {
            if (!args[1]) return m.reply("Masukkan URL anime dari Otakudesu.");
            let data = await animeDetail(args[1]);
            if (data.error) return m.reply(data.error);

            let message = `*Judul :* ${data.title}\n\n*Japanese :* ${data.titleJapanese}\n\n*Skor :* ${data.score}\n\n*Studio :* ${data.studio}\n*Release Date :* ${data.releaseDate}\n\n*Total Episode :* ${data.totalEpisodes}\n\n*Genre :* ${data.genres}\n\n*Sinopsis :* ${data.synopsis.slice(0, 500)}...\n\n*Link :* ${data.url}`;

            await conn.sendMessage(m.chat, { image: { url: data.image }, caption: message }, { quoted: m });
        } else if (args[0] === "episode") {
            const episodeResults = await episodeData(args[1]);
            if (episodeResults && episodeResults.episodes.length > 0) {
                let reply = episodeResults.episodes
                    .map(episode => `📺 Episode: ${episode.title}\n🔗 Link: ${episode.url}\n📅 Tanggal: ${episode.date}\n`)
                    .join(`\n${separator}\n`);
                reply = episodeHeader + ' ' + `untuk *${episodeResults.title}*\n` + separator + '\n' + reply;
                return m.reply(reply);
            } else {
                return m.reply('Maaf, tidak ditemukan informasi episode.');
            }
        } else if (args[0] === "download") {
            const downloadResults = await linkDownloadData(args[1]);
            if (downloadResults) {
                let reply = downloadResults.episodes
                    .map(episode => {
                        const links = episode.links.map(link => `🔗 ${link.text}: ${link.url}`).join('\n');
                        return `📺 Episode: ${episode.title}\n${links}\n💾 Size: ${episode.size}\n`;
                    })
                    .join(`\n${separator}\n`);
                reply = downloadHeader + ' ' + `untuk *${downloadResults.title}*\n🔗 Stream: ${downloadResults.frame}\n` + separator + '\n' + reply;
                return m.reply(reply);
            } else {
                return m.reply('Maaf, tidak ditemukan link download.');
            }
        } else if (args[0] === "video") {
            const videoLink = await videoData(args[1]);
            let doc = {
                video: {
                    url: videoLink
                },
                mimetype: "video/mp4",
                caption: "*[ Result ]*"
            };

            await conn.sendMessage(m.chat, doc, { quoted: m });
        } else {
            return m.reply("Gunakan format yang benar.");
        }
    }
};

handler.help = ["otakudesu"];
handler.command = ["otakudesu"];
handler.tags = ["anime"];

module.exports = handler;