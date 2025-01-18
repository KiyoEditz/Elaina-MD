const fetch = require('node-fetch');
const cheerio = require('cheerio');

class NekoPoi {
    async latest() {
        try {
            const response = await fetch("https://nekopoi.care");
            const html = await response.text();
            const $ = cheerio.load(html);

            const series = [];
            const episode = [];

            $(".animeseries ul li").each((_, element) => {
                const htmlContent = $(element).find("a").attr("original-title");
                const exec = cheerio.load(htmlContent);

                const info = {};
                exec(".areadetail p").each((_, infoElement) => {
                    const name = exec(infoElement).find("b").text().trim();
                    const value = exec(infoElement).text().replace(`${name}:`, "").trim();
                    info[name.split(" ").join("_").toLowerCase().trim()] = value;
                });

                series.push({
                    title: exec(".infoarea h2").eq(0).text(),
                    thumbnail: exec(".areabaru img").attr("src"),
                    ...info,
                    url: $(element).find("a").attr("href"),
                });
            });

            $("#boxid .eropost").each((_, element) => {
                episode.push({
                    title: $(element).find(".eroinfo h2 a").text().trim(),
                    release: $(element).find(".eroinfo span").eq(0).text().trim(),
                    url: $(element).find(".eroinfo h2 a").attr("href"),
                });
            });

            return { series, episode };
        } catch (error) {
            throw new Error(`Failed to fetch latest data: ${error.message}`);
        }
    }

    async detail(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);

            const result = {
                metadata: {},
                episode: [],
            };

            $(".animeinfos .listinfo ul li").each((_, element) => {
                const name = $(element).find("b").text().trim();
                const value = $(element).text().replace(`${name}:`, "").trim();
                result.metadata[name.toLowerCase()] = value;
            });

            result.metadata.thumbnail = $(".animeinfos .imgdesc img").attr("src");
            result.metadata.sinopsis = $(".animeinfos p").text();

            $(".animeinfos .episodelist ul li").each((_, element) => {
                result.episode.push({
                    title: $(element).find("span").eq(0).find("a").text().trim(),
                    release: $(element).find("span").eq(1).text().trim(),
                    url: $(element).find("span").eq(0).find("a").attr("href"),
                });
            });

            return result;
        } catch (error) {
            throw new Error(`Failed to fetch detail data: ${error.message}`);
        }
    }

    async episode(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);

            const result = {
                metadata: {},
                download: [],
            };

            $(".contentpost").each((_, element) => {
                result.metadata.title = $(element).find("img").attr("title");
                result.metadata.images = $(element).find("img").attr("src");
                result.metadata.synopsis = $(element).find(".konten").find("p:nth-of-type(2)").text();
            });

            result.metadata.stream = $("#show-stream").find("#stream1 iframe").attr("src");

            $(".liner").each((_, element) => {
                const name = $(element).find(".name").text();
                const links = [];

                $(element).find(".listlink a").each((_, link) => {
                    links.push({
                        name: $(link).text().trim(),
                        url: $(link).attr("href"),
                    });
                });

                result.download.push({
                    title: name,
                    source: links,
                });
            });

            return result;
        } catch (error) {
            throw new Error(`Failed to fetch episode data: ${error.message}`);
        }
    }

    async search(q) {
        try {
            const response = await fetch(`https://nekopoi.care/?s=${encodeURIComponent(q)}`);
            const html = await response.text();
            const $ = cheerio.load(html);

            const episode = [];

            $(".result ul li").each((_, element) => {
                const link = $(element).find("h2 a").attr("href");
                episode.push({
                    title: $(element).find("h2 a").text().trim(),
                    type: link.includes("/hentai/") ? "Hentai Series" : "Hentai Episodes",
                    images: $(element).find("img").attr("src"),
                    url: link,
                });
            });

            return episode;
        } catch (error) {
            throw new Error(`Failed to fetch search results: ${error.message}`);
        }
    }
}

module.exports = new NekoPoi();