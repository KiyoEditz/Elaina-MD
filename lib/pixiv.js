const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const pixiv = {
    api: {
        base: "https://www.pixiv.net",
        endpoints: {
            search: "/ajax/search/artworks/",
            illust: "/ajax/illust/"
        },
        proxy: "https://api.xiaomiao-ica.top/agent/index.php",
        upload: "https://catbox.moe/user/api.php"
    },

    headers: {
        'accept': 'application/json',
        'referer': 'https://www.pixiv.net/',
        'user-agent': 'Postify/1.0.0',
        'x-requested-with': 'XMLHttpRequest'
    },

    defaults: {
        useProxy: true,
        useCatbox: false,
        useBuffer: false,
        outputType: 'url',
        deleteAfterUpload: true,
        cookie: null
    },

    orderTypes: {
        'date_d': 'Terbaru ke Terlama',
        'date': 'Terlama ke Terbaru',
        'popular_d': 'Populer Hari Ini',
        'popular_male_d': 'Populer dari Laki-laki',
        'popular_female_d': 'Populer dari Perempuan'
    },

    isOrder(order) {
        return Object.keys(this.orderTypes).includes(order);
    },

    getOrder() {
        return Object.entries(this.orderTypes).map(([key, value]) => ({
            type: key,
            description: value
        }));
    },

    isUrl(str) {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    },

    isPix(url) {
        if (!url) return false;
        const patterns = [
            /^https?:\/\/(?:www\.)?pixiv\.net\/(?:en\/)?artworks\/\d+/,
            /^https?:\/\/(?:www\.)?pixiv\.net\/(?:\w{2}\/)?artworks\/\d+/,
            /^https?:\/\/(?:www\.)?pixiv\.net\/(?:en\/)?users\/\d+/,
            /^https?:\/\/(?:www\.)?pixiv\.net\/member\.php\?id=\d+/,
            /^https?:\/\/(?:www\.)?pixiv\.net\/(?:en\/)?tags\/.*?\/artworks/,
            /^https?:\/\/i\.pximg\.net\/img-.*?\/img\/.*?\/\d+_p\d+\.\w+$/
        ];
        return patterns.some(pattern => pattern.test(url.trim().toLowerCase()));
    },

    tipex(url) {
        if (!url) return null;

        const patterns = {
            artwork: /artworks\/\d+/,
            user: /users\/\d+|member\.php\?id=\d+/,
            tag: /tags\/.*?\/artworks/,
            direct: /i\.pximg\.net\/img-.*?\/img/
        };

        return Object.keys(patterns).find(type => patterns[type].test(url)) || null;
    },

    desc(c) {
        if (!c) return '';
        return c.replace(/<[^>]*>/g, '').replace(/https?:\/\/[^\s]+/g, '').replace(/&[^;]+;/g, '').trim();
    },

    async getCookies(kukis = null) {
        try {
            if (kukis) return kukis;

            const response = await axios.get(this.api.base);
            const setHeaders = response.headers['set-cookie'];
            return setHeaders ? setHeaders.map(cookie => cookie.split(';')[0].trim()).join('; ') : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    proxies(url) {
        return `${this.api.proxy}?dns=8.8.8.8&fileUrl=${encodeURIComponent(url)}&referer=https://www.pixiv.net`;
    },

    async up2Catbox(filepath) {
        try {
            const formData = new FormData();
            formData.append('reqtype', 'fileupload');
            formData.append('fileToUpload', fs.createReadStream(filepath));

            const response = await axios.post(this.api.upload, formData, {
                headers: formData.getHeaders()
            });

            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async imagesx(url, options = {}) {
        const opt = { ...this.defaults, ...options };

        const dlink = opt.useProxy ? this.proxies(url) : url;
        const headers = opt.useProxy ? {} : { 'Referer': 'https://www.pixiv.net/' };

        const response = await axios.get(dlink, { responseType: 'arraybuffer', headers });
        const buffer = Buffer.from(response.data, 'binary');
        const filename = url.split('/').pop();
        const result = { original: url };

        if (opt.useProxy) result.proxy = dlink;
        if (opt.useBuffer) result.buffer = buffer;

        if (opt.useCatbox) {
            const filepath = path.join(options.directory || 'Downloads', filename);
            fs.writeFileSync(filepath, buffer);
            result.catbox = await this.up2Catbox(filepath);
            if (opt.deleteAfterUpload) fs.unlinkSync(filepath);
        }

        result.mime = response.headers['content-type'];
        result.size = buffer.length;
        return result;
    },

    async search(query, options = {}) {
        if (!query) {
            return { status: false, code: 400, result: { error: "Querynya mana bree?" } };
        }

        if (options.order && !this.isOrder(options.order)) {
            return { status: false, code: 400, result: { error: "Order type tidak valid.", valid_orders: this.getOrder() } };
        }

        try {
            const cookies = await this.getCookies(options.cookie);
            if (!cookies) return { status: false, code: 400, result: { error: "Kukisnya kosong." } };

            const page = options.page || 1;
            const limit = options.limit || 20;
            const params = {
                word: query,
                order: options.order || 'date_d',
                mode: 'all',
                p: page,
                s_mode: 's_tag_full',
                type: 'all',
                lang: 'en',
                version: options.version || ''
            };

            const { data } = await axios.get(`${this.api.base}/ajax/search/artworks/${encodeURIComponent(query)}`, {
                headers: { ...this.headers, cookie: cookies },
                params
            });

            if (!data.body || !data.body.illustManga || !data.body.illustManga.data) {
                return { status: false, code: 404, result: { error: `Tidak ada hasil untuk: ${query}` } };
            }

            const results = data.body.illustManga.data.slice(0, limit).map(artwork => ({
                id: artwork.id,
                title: artwork.title,
                type: artwork.illustType === 2 ? 'ugoira' : artwork.illustType === 1 ? 'manga' : 'illustration',
                description: this.desc(artwork.description),
                created_at: artwork.createDate,
                uploaded_at: artwork.uploadDate,
                urls: { mini: artwork.url, thumb: artwork.url, small: artwork.url, regular: artwork.url, original: artwork.url },
                stats: { views: artwork.viewCount, bookmarks: artwork.bookmarkCount, likes: artwork.likeCount },
                artist: { id: artwork.userId, name: artwork.userName, account: artwork.userAccount, profile_url: `https://www.pixiv.net/users/${artwork.userId}` },
                tags: artwork.tags.map(tag => ({ name: tag, translated: null }))
            }));

            return { status: true, code: 200, result: { query, page, limit, order: { type: params.order, description: this.orderTypes[params.order] }, total: data.body.illustManga.total, artworks: results, hasNextPage: data.body.illustManga.hasNextPage, nextPage: data.body.illustManga.hasNextPage ? page + 1 : null } };
        } catch (error) {
            return { status: false, code: error.response?.status || 500, result: { error: "Server error." } };
        }
    }
};

module.exports = pixiv;