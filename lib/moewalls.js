// Live Wallpaper Anime By: DaniDesignA :) 
// Jangan Hapus Wm Hargai Yang Sudah Membuat fitur Ini
// Klo Eror Chat: wa.me/6285819572683

const axios = require('axios');
const cheerio = require('cheerio');

async function moewalls(query = '', options = {}) {
    const defaultOptions = {
        baseUrl: 'https://moewalls.com',
        timeout: 10000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    };

    const config = { ...defaultOptions, ...options };

    try {
        const searchUrl = query
            ? `${config.baseUrl}/?s=${encodeURIComponent(query)}`
            : config.baseUrl;

        const response = await axios.get(searchUrl, {
            timeout: config.timeout,
            headers: config.headers
        });

        const $ = cheerio.load(response.data);
        const wallpapers = [];

        $('.g1-collection-item, .g1-collection-item-l, .snax-list-item').each((index, element) => {
            const $item = $(element);

            const title = $item.find('.entry-title a').text().trim();
            let thumbnail = $item.find('img').attr('data-src') || $item.find('img').attr('src');
            let source = $item.find('.entry-title a').attr('href');

            if (!title || !source) return;

            if (thumbnail) {
                if (thumbnail.startsWith('//')) {
                    thumbnail = 'https:' + thumbnail;
                } else if (thumbnail.startsWith('/')) {
                    thumbnail = config.baseUrl + thumbnail;
                }
            }

            if (source) {
                if (source.startsWith('//')) {
                    source = 'https:' + source;
                } else if (source.startsWith('/')) {
                    source = config.baseUrl + source;
                }
            }

            const wallpaper = {
                title,
                thumbnail,
                source,
                index: index + 1,
                video: '' // Akan diisi nanti
            };

            wallpapers.push(wallpaper);
        });

        async function getWallpaperDetails(pageUrl) {
            try {
                const pageResponse = await axios.get(pageUrl, {
                    timeout: config.timeout,
                    headers: config.headers
                });
                const $page = cheerio.load(pageResponse.data);

                // Ekstraksi video URL
                let video =
                    $page('video source').attr('src') ||
                    $page('video').attr('src') ||
                    $page('.snax-download-link').attr('href') ||
                    $page('a.wallpaper-download-link').attr('href');

                if (video) {
                    if (video.startsWith('//')) {
                        video = 'https:' + video;
                    } else if (video.startsWith('/')) {
                        video = config.baseUrl + video;
                    }
                }

                return { video };
            } catch (error) {
                return { video: null };
            }
        }

        if (typeof options.index === 'number') {
            if (wallpapers[options.index]) {
                const details = await getWallpaperDetails(wallpapers[options.index].source);
                Object.assign(wallpapers[options.index], details);
            }
        } else {
            for (let wallpaper of wallpapers) {
                const details = await getWallpaperDetails(wallpaper.source);
                Object.assign(wallpaper, details);
            }
        }

        return {
            query,
            total: wallpapers.length,
            wallpapers
        };
    } catch (error) {
        return {
            query,
            total: 0,
            error: error.message,
            wallpapers: []
        };
    }
}

moewalls.getWallpaperDetails = async function(pageUrl, options = {}) {
    const baseUrl = options.baseUrl || 'https://moewalls.com';
    const timeout = options.timeout || 10000;
    const headers = options.headers || {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    try {
        const pageResponse = await axios.get(pageUrl, { timeout, headers });
        const $page = cheerio.load(pageResponse.data);
        let video =
            $page('video source').attr('src') ||
            $page('video').attr('src') ||
            $page('.snax-download-link').attr('href') ||
            $page('a.wallpaper-download-link').attr('href');
        if (video) {
            if (video.startsWith('//')) {
                video = 'https:' + video;
            } else if (video.startsWith('/')) {
                video = baseUrl + video;
            }
        }
        return { video };
    } catch {
        return { video: null };
    }
};

module.exports = moewalls;